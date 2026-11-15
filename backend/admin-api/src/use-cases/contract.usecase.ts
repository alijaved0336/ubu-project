import { NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { BadRequestException } from '@nestjs/common';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { CampaignStatus } from '@infrastructure/utils/constant';
import { ContractRepository } from '@infrastructure/orm/reposiories/contract.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { SubmitContractDTO } from '@infrastructure/presentation/contract/contract.dto';
import { User } from '@infrastructure/orm/entities/user.entity';
import { generateHTMLContent } from '../infrastructure/utils/contract-doc-helper-functions';
import { v4 as uuidv4 } from 'uuid';
import { Contract } from '@infrastructure/orm/entities/contract.entity';

export class ContractUsecase {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private mailgunService: MailGunService,
    private campaignRepository: CampaignRepository,
    private contractRepository: ContractRepository,
    private userRepository: UserRepository,
  ) {}
  async uploadSignature(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required and should be valid');
    }

    const folderName = 'signature_new';
    const uniqueFileName = `${folderName}/${uuidv4()}-${file.originalname}`;

    try {
      const uploadResult = await this.awsS3Service.uploadFile(file, uniqueFileName);
      if (!uploadResult) {
        throw new Error('File upload to S3 failed');
      }
      return {
        message: 'File uploaded successfully',
        fileUrl: uploadResult.Location,
      };
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }
  async createContractDocument(brandSignUrl: string, influencerSignUrl: string, campaignId: number, userId: number): Promise<String> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Associated user not found');
    }
    const campaign = await this.campaignRepository.findCampaignById(campaignId);
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found.`);
    }

    const contract = await this.contractRepository.findByCampaignId(campaignId);

    if (user.is_influencer === true) {
      if (contract?.brandSignUrl) {
        brandSignUrl = contract?.brandSignUrl;
      } else {
        throw new NotFoundException('Brand sign URL not found on contract');
      }
    } else if (user.is_brand === true) {
      if (contract?.influencerSignUrl) {
        throw new ConflictException('Contract already exists for this campaign and is signed by the influencer.');
      }
    }

    const directory = path.join(__dirname, '../../../../temp');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const fileName = `contract-document-${Date.now()}.pdf`;
    const filePath = path.join(directory, fileName);

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return new Promise(async (resolve, reject) => {
      try {
        // Launch Puppeteer
        const isProduction = process.env.NODE_ENV === 'production';
        const env = process.env.NODE_ENV || 'dev';

        // Define Puppeteer launch options based on the environment
        let launchOptions = {};
        // if (env === 'production') {
        launchOptions = {
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        };
        //}

        //While Locally please remove launchOptions from i.e. launch(launchOptions);
        const browser = await puppeteer.launch(launchOptions);
        //const browser = await puppeteer.launch();

        const page = await browser.newPage();

        // Set the content and generate the PDF
        await page.setContent(generateHTMLContent(brandSignUrl, influencerSignUrl));
        await page.pdf({ path: filePath, format: 'A4', printBackground: true });

        // Close Puppeteer browser
        await browser.close();

        // Handle file stream and S3 upload
        await this.awsS3Service.createFolder('contract-documents_new');
        const s3Response = await this.awsS3Service.uploadFileFromPath(filePath, 'contract-documents_new');

        // Clean up the local file
        fs.unlinkSync(filePath);
        resolve(s3Response.Location ?? '');
      } catch (error) {
        reject(`Error generating or uploading PDF: ${error.message}`);
      }
    });
  }
  async submitContract(submittedContract: SubmitContractDTO, user: User): Promise<String> {
    const { campaignId, contractDocumentUrl, brandSignUrl, influencerSignUrl } = submittedContract;

    const campaign = await this.campaignRepository.findCampaignById(campaignId);
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found.`);
    }
    const influencerUser = await this.userRepository.findUserByInfluencerId(campaign?.influencerId);
    if (!influencerUser) {
      throw new NotFoundException(`Influencer not found.`);
    }
    const contract = await this.contractRepository.findByCampaignId(campaignId);

    if (!user) {
      throw new NotFoundException('Associated user not found');
    }
    if (!campaign) {
      throw new NotFoundException('Associated campaign not found');
    }

    let savedContract;
    if (!contract && user?.is_brand == true) {
      const newContract = await this.contractRepository.create({
        campaign,
        brandSignUrl,
        influencerSignUrl,
        contractDocumentUrl: contractDocumentUrl,
      });
      savedContract = await this.contractRepository.save(newContract);
      await this.campaignRepository.updateCampaignStatus(campaignId, CampaignStatus.CONTRACT_SIGNING);
    } else {
      // updating the previous records
      if (contract && user?.is_influencer === true) {
        contract.influencerSignUrl = influencerSignUrl;
        contract.contractDocumentUrl = contractDocumentUrl;
        savedContract = await this.contractRepository.save(contract);
        await this.campaignRepository.updateCampaignStatus(campaignId, CampaignStatus.IN_PROGRESS);
      } else {
        if (user?.is_brand) {
          throw new ConflictException('Contract Already Signed & Sent to Influencer!');
        }
      }
    }

    if (savedContract) {
      const emailSubject = 'UBU Contract Signing Alert!';

      const emailBody = `
  <div style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px;">
    <div style="text-align: center; padding: 10px 0; background-color: #000;">
      <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
        UBU
      </h1>
    </div>
    <div style="padding: 20px;">
      <h1 style="font-size: 24px; color: #000; text-align: center;">New Contract Alert from UBU</h1>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Dear Influencer,
      </p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        We are thrilled to let you know that a new campaign contract has been initiated for you. Please take a moment to review the contract.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="http://ubu.live/dashboard/campaigns/${campaignId}/review-contract" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Contract</a>
      </div>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Best regards,<br>
        The UBU Team
      </p>
    </div>
    <div style="text-align: center; padding: 10px; background-color: #f0f0f0;">
      <p style="font-size: 12px; color: #888;">UBU Corporation<br>
      You are receiving this email because you opted in via our website.</p>
      <div style="margin-top: 10px;">
        <a href="https://tiktok.com" style="text-decoration: none; color: #888;">TikTok</a> |
        <a href="https://facebook.com" style="text-decoration: none; color: #888;">Facebook</a> |
        <a href="https://instagram.com" style="text-decoration: none; color: #888;">Instagram</a>
      </div>
    </div>
  </div>
`;

      const resp = await this.mailgunService.sendEmail(influencerUser?.email, emailSubject, emailBody, true);

      if (!resp.success) {
        console.error('Failed to send email:', resp.error);
      }
    }

    return savedContract;
  }

  async getContractById(id: string): Promise<Contract | null> {
    return this.contractRepository.findOne(Number(id));
  }

  async getContractDocumentByCampaignId(campaignId: number, userId: number): Promise<string | null> {
    const authoriseUser = await this.campaignRepository.isUserAssociatedWithCampaign(campaignId, userId);
    if (!authoriseUser) {
      throw new UnauthorizedException('You are not authorized to access this campaign.');
    }
    const contract = await this.contractRepository.findByCampaignId(campaignId);
    if (!contract) {
      throw new NotFoundException('Contract not found for the given Campaign ID.');
    }
    return contract ? contract.contractDocumentUrl : null;
  }

  async getContractDocumentById(campaignId: number): Promise<string | null> {
    const contract = await this.contractRepository.findOne(campaignId);
    if (!contract) {
      throw new NotFoundException('Contract not found for the given Campaign ID.');
    }
    return contract ? contract.contractDocumentUrl : null;
  }

  async getContractByCampaignId(campaignId: number): Promise<Contract | null> {
    return await this.contractRepository.findByCampaignId(campaignId);
  }
}
