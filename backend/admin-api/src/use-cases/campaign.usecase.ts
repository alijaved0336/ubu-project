import { CampaignDisputeStatus, ResolutionAction } from '@infrastructure/orm/entities/campaign-dispute.entity';
import { PlanType } from '@infrastructure/orm/entities/ubuSubscription.entity';
import { User } from '@infrastructure/orm/entities/user.entity';
import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import * as fs from 'fs';
import * as path from 'path';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { CampaignDisputeRepository } from '@infrastructure/orm/reposiories/campaign-dispute.repository';
import { ContractRepository } from '@infrastructure/orm/reposiories/contract.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { UBUSubscriptionRepository } from '@infrastructure/orm/reposiories/ubu-subscription.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { WebSocketProviderService } from '@infrastructure/sockets/web-socket-provider';
import { CampaignStatus, convertDateFormat } from '@infrastructure/utils/constant';
import { ConflictException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { CampaignCount } from 'constants/campaign';
import UsecaseProxy, {
  CAMPAIGN_DISPUTE_USECASE_PROXY,
  CAMPAIGN_PAYMENT_USECASE_PROXY,
  EXHIBITDOCUMENT_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import * as puppeteer from 'puppeteer';
import { Server } from 'socket.io';
import { DataSource, In } from 'typeorm';
import { CampaignUsersResponseDto, CreateCampaignDto, CreateDocumentDto } from '../infrastructure/presentation/campaign/campaign.dto';
import { CreateExhibitDocumentDto } from '../infrastructure/presentation/exhibit-documents/exhibit-documents.dto';
import { generateHTMLContent } from '../infrastructure/utils/contract-doc-helper-functions';
import {
  generateAdditionalNotes,
  generateCommunicationSection,
  generateCompensation,
  generateContentGuidelines,
  generateDeliverables,
  generateSection,
  generateTimeline,
} from '../infrastructure/utils/exhibit-doc-helper-functions';
import { CampaignDisputeUseCase } from './campaign-dispute.usecase';
import { CampaignPaymentUseCase } from './campaign-payment.usecase';
import { ExhibitDocumentUsecase } from './exhibit-document.usecase';
const PDFDocument = require('pdfkit');

@Injectable()
export class CampaignUsecase {
  server: Server;

  constructor(
    @InjectRepository(CampaignRepository)
    private readonly campaignRepository: CampaignRepository,
    private readonly campaignDisputeRepository: CampaignDisputeRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly userRepository: UserRepository,
    private readonly influencerRepository: InfluencerRepository,
    private readonly brandRepository: BrandRepository,
    private readonly contractRepository: ContractRepository,
    private readonly ubuSubscriptionRepository: UBUSubscriptionRepository,
    private mailgunService: MailGunService,
    private readonly dataSource: DataSource,
    @Inject(EXHIBITDOCUMENT_USECASE_PROXY)
    private readonly exhibitDocumentUsecase: UsecaseProxy<ExhibitDocumentUsecase>,
    private readonly webSocketProvider: WebSocketProviderService,
    private readonly notificationRepo: NotificationRepository,
    @Inject(CAMPAIGN_PAYMENT_USECASE_PROXY)
    private readonly campaignPaymentUseCase: UsecaseProxy<CampaignPaymentUseCase>,
    @Inject(CAMPAIGN_DISPUTE_USECASE_PROXY)
    private readonly campaignDisputeUseCase: UsecaseProxy<CampaignDisputeUseCase>,
  ) {}

  private async registerSocketEvents(event: string, data: any, to: any) {
    this.server = this.webSocketProvider.getServerInstance();
    if (!this.server) {
      console.error('Server instance not initialized');
      return;
    }

    try {
      console.log(`Socket event "${event}" emitted with data:`, data);
      if (to) {
        this.server.to(to).emit(event, data);
      } else {
        this.server.emit(event, data);
      }
      console.log(`Socket event "${event}" emitted with data:`, data);
    } catch (error) {
      console.error('Error emitting socket event:', error);
    }
  }

  async createDocument(payload: CreateDocumentDto & { userId: number }): Promise<string> {
    const influencer = await this.influencerRepository.findOne(payload.influencerId);
    if (!influencer || !influencer.user) {
      throw new NotFoundException('Influencer or associated user not found');
    }

    const brand = await this.brandRepository.findByUserId(payload.userId);
    if (!brand || !brand.user) {
      throw new NotFoundException('Brand or associated user not found');
    }
    const influencerDetails = {
      name: `${influencer.user.first_name} ${influencer.user.last_name}`,
      email: influencer.user.email,
      phone: influencer.user.phone_number,
      address: influencer.user.address,
      city: influencer.user.city,
      state: influencer.user.state,
      zip_code: influencer.user.zip_code,
    };

    const brandDetails = {
      name: brand.user.first_name,
      email: brand.user.email,
      phone: brand.user.phone_number,
      address: brand.user.address,
      city: brand.user.city,
      state: brand.user.state,
      zip_code: brand.user.zip_code,
    };
    const directory = path.join(__dirname, '../../../../temp');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const fileName = `exhibit-a-document-${Date.now()}.pdf`;
    const filePath = path.join(directory, fileName);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(filePath);
      doc.pipe(fileStream);

      // Title and Header Section
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Exhibit A: Identification of Parties, Scope of Work, Deliverables, Compensation, and Communication Details', { align: 'center' })
        .moveDown();

      doc
        .font('Helvetica')
        .fontSize(11)
        .text(`This Collaboration Agreement (the "Agreement") is made and entered into as of ${currentDate}, by and between:`, { align: 'left' })
        .moveDown(2);

      // Influencer and Brand details
      doc.font('Helvetica-Bold').fontSize(11).text('Brand:', { underline: true });
      doc.font('Helvetica').fontSize(11).text(brandDetails.name);
      doc.font('Helvetica').fontSize(11).text(brandDetails.address);
      doc.font('Helvetica').fontSize(11).text(brandDetails.city);
      doc.font('Helvetica').fontSize(11).text(brandDetails.state);
      doc.font('Helvetica').fontSize(11).text(brandDetails.zip_code);
      doc.font('Helvetica').fontSize(11).text(brandDetails.email);
      doc.font('Helvetica').fontSize(11).text(brandDetails.phone).moveDown(2);
      doc.font('Helvetica-Bold').fontSize(11).text('Influencer:', { underline: true });
      doc.font('Helvetica').fontSize(11).text(influencerDetails.name);
      doc.font('Helvetica').fontSize(11).text(influencerDetails.address);
      doc.font('Helvetica').fontSize(11).text(influencerDetails.city);
      doc.font('Helvetica').fontSize(11).text(influencerDetails.state);
      doc.font('Helvetica').fontSize(11).text(influencerDetails.zip_code);
      doc.font('Helvetica').fontSize(11).text(influencerDetails.email);
      doc.font('Helvetica').fontSize(11).text(influencerDetails.phone).moveDown(2);

      // Dynamic sections
      doc.font('Helvetica-Bold').fontSize(14).text('Campaign Name: ', { continued: true }).font('Helvetica').text(payload.campaignName).moveDown();
      generateSection(doc, '1. Scope of Work', payload.description);
      generateDeliverables(doc, payload);
      generateTimeline(doc, convertDateFormat(payload.campaignAcceptanceDeadline), convertDateFormat(payload.publicationDates));
      generateCompensation(doc, payload.totalCompensation);
      generateContentGuidelines(doc, payload.brandGuidelines);
      generateCommunicationSection(doc, brandDetails, influencerDetails);
      generateAdditionalNotes(doc, payload.specialConditions, payload.revisions);

      doc.end();

      // Handle stream completion and S3 upload
      fileStream.on('finish', async () => {
        try {
          await this.awsS3Service.createFolder('exhibit-documents_new');
          const s3Response = await this.awsS3Service.uploadFileFromPath(filePath, 'exhibit-documents_new');

          // Clean up the local file
          fs.unlinkSync(filePath);
          resolve(s3Response.Location ?? '');
        } catch (error) {
          reject(`Error uploading to S3: ${error.message}`);
        }
      });

      fileStream.on('error', (error) => {
        reject(`File stream error: ${error.message}`);
      });
    });
  }
  async createContractDocument(brandSignUrl: string, influencerSignUrl: string, campaignId: number, userId: number): Promise<String> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Associated user not found');
    }
    const campaign = await this.campaignRepository.findCampaignById(campaignId);
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
        if (env === 'production') {
          launchOptions = {
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
          };
        }
        //While Locally please remove launchOptions from i.e. launch(launchOptions);
        const browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();

        // Set the content and generate the PDF
        await page.setContent(generateHTMLContent(brandSignUrl, influencerSignUrl));
        await page.pdf({ path: filePath, format: 'A4', printBackground: true });

        // Close Puppeteer browser
        await browser.close();

        // Handle file stream and S3 upload
        await this.awsS3Service.createFolder('contract-documents_new');
        const s3Response = await this.awsS3Service.uploadFileFromPath(filePath, 'contract-documents_new');

        return s3Response;
      } catch (error) {
        reject(`Error generating or uploading PDF: ${error.message}`);
      }
    });
  }

  async createCampaign(payload: CreateCampaignDto & { userId: number }, document: CreateExhibitDocumentDto) {
    const { segmentId, influencerId, status, campaignName } = payload;

    const brand = await this.brandRepository.findByUserId(payload.userId);
    if (!brand || !brand.user) {
      throw new NotFoundException('Brand or associated user not found:::create Campaign');
    }

    const influencer = await this.influencerRepository.findOne(payload.influencerId);
    if (!influencer || !influencer.user) {
      throw new NotFoundException('Influencer or associated user not found');
    }

    const brandId = brand.id;
    const campaign = this.campaignRepository.create({
      segmentId,
      influencerId,
      brandId,
      status,
      campaignName: campaignName,
    });

    const savedCampaign = await this.campaignRepository.save(campaign);

    if (savedCampaign) {
      const emailSubject = 'UBU New Campaign Alert';

      const emailBody = `
        <div style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px;">
          <div style="text-align: center; padding: 10px 0; background-color: #000;">
            <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
              UBU
            </h1>
          </div>
          <div style="padding: 20px;">
            <h1 style="font-size: 24px; color: #000; text-align: center;">UBU New Campaign Alert</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Dear ${influencer.user.first_name} ${influencer.user.last_name},
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              We are excited to inform you that ${brand.user.first_name} has launched a new campaign on UBU and you are invited to accept! This is a great opportunity to collaborate and create engaging content for your followers.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://ubu.live/dashboard/campaigns/${savedCampaign.id}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Campaign</a>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Regards,<br>
              UBU Team
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

      const resp = await this.mailgunService.sendEmail(
        // 'ace@ubu.live',
        influencer.user.email,
        emailSubject,
        emailBody,
        true,
      );

      if (!resp.success) {
        console.error(resp.error);
      }
    }
    const exhibitDocument = await this.exhibitDocumentUsecase.getInstance().createExhibitDocumentRecord({ ...document }, savedCampaign.id);

    return { savedCampaign, exhibitDocument };
  }

  async isUserEligibleToCreateCampaign(userId: number): Promise<boolean> {
    // userId = 822;

    const brand = await this.brandRepository.findByUserId(userId);
    const subscription = await this.ubuSubscriptionRepository.getUserSubscriptionInfo(userId);

    if (!subscription) {
      return false;
    }

    // Extract subscription start and end dates
    const { subs_start_date: subscriptionStartDate, subs_end_date: subscriptionEndDate } = subscription;

    let campaignCount = 0;

    if (brand) {
      // Fetch the campaigns within the subscription period
      const campaigns = await this.campaignRepository.findCampaignByBrand(subscriptionStartDate, subscriptionEndDate);
      campaignCount = campaigns.total;

      // Determine the campaign limit based on the subscription plan type
      switch (subscription.plan_type) {
        case PlanType.BASIC:
          return campaignCount < CampaignCount.BASIC_CAMPAIGN_COUNT_LIMIT;

        case PlanType.PROFESSIONAL:
          return campaignCount < CampaignCount.PROFESSIONAL_CAMPAIGN_COUNT_LIMIT;

        case PlanType.ENTERPRISE:
          return campaignCount < CampaignCount.ENTERPRISE_CAMPAIGN_COUNT_LIMIT;

        default:
          return false;
      }
    }

    return false;
  }

  async editCampaign(payload: CreateCampaignDto & { userId: number }, document: CreateExhibitDocumentDto, id: number) {
    const { segmentId, influencerId, status } = payload;
    const { userId, ...campaignData } = payload;
    const update = await this.campaignRepository.update(id, campaignData);
    const savedCampaign = await this.campaignRepository.findCampaignById(id);
    if (!savedCampaign) {
      throw new NotFoundException('Campaign not found');
    }
    const savedCampaignStatus = savedCampaign.status;
    if (savedCampaignStatus !== CampaignStatus.PENDING) {
      throw new ConflictException('The campaign is already approved and cannot be modified.');
    }
    const influencer = await this.influencerRepository.findOne(savedCampaign.influencerId);
    if (!influencer) {
      throw new NotFoundException('Influencer not found');
    }

    const brand = await this.brandRepository.findOne(savedCampaign.brandId);
    if (!brand || !brand.user) {
      throw new NotFoundException('Influencer not found');
    }
    if (savedCampaign) {
      const emailSubject = 'UBU New Campaign Alert';

      const emailBody = `
        <div style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px;">
          <div style="text-align: center; padding: 10px 0; background-color: #000;">
            <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
              UBU
            </h1>
          </div>
          <div style="padding: 20px;">
            <h1 style="font-size: 24px; color: #000; text-align: center;">UBU New Campaign Alert</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Dear ${influencer.user.first_name} ${influencer.user.last_name},
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              We are excited to inform you that ${brand.user.first_name} has launched a new campaign on UBU and you are invited to accept! This is a great opportunity to collaborate and create engaging content for your followers.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://ubu.live" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Campaign</a>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Regards,<br>
              UBU Team
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

      const resp = await this.mailgunService.sendEmail(
        // 'ace@ubu.live',
        influencer.user.email,
        emailSubject,
        emailBody,
        true,
      );

      if (!resp.success) {
        console.error('Failed to send email:', resp.error);
      }
    }
    const exhibitDocument = await this.exhibitDocumentUsecase.getInstance().createExhibitDocumentRecord({ ...document }, savedCampaign.id);

    return { savedCampaign, exhibitDocument };
  }

  async findAll(userId: number, page: number, limit: number, search?: string) {
    const brand = await this.brandRepository.findByUserId(userId);
    if (brand) {
      return this.campaignRepository.findByBrands(brand.id, page, limit, search);
    }
    const influencer = await this.influencerRepository.findInfluncerByUserId(userId);
    if (influencer) {
      return this.campaignRepository.findByInfluencer(influencer.id, page, limit, search);
    }
    if (!brand && !influencer) throw new NotFoundException('User not found');
  }

  async getOneWithLatestDocument(id) {
    const result = await this.campaignRepository.getOneWithLatestDocument(id);

    if (!result) {
      return { result: null, allowAcceptAndReject: false };
    }

    const completedCompaignsWithoutReviewByInfluencer = await this.campaignRepository.completedCompaignsWithoutReviewByInfluencer(result.influencerId);
    const allowAcceptAndReject = completedCompaignsWithoutReviewByInfluencer.length === 0;
    return { result, allowAcceptAndReject };
  }

  async createDispute(user: User, campaignId: number, brandConcerns: string, influencerConcerns: string, isRefundRequested: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const campaign = await this.campaignRepository.findCampaignById(campaignId);
      if (campaign?.status == CampaignStatus.DISPUTED) {
        throw new NotFoundException('A dispute is already raised for this campaign');
      }
      if (!campaign || !campaign.influencer || !campaign.brand) {
        throw new NotFoundException('Campaign not found');
      }
      if (isRefundRequested) {
        await this.campaignPaymentUseCase.getInstance().requestRefund(campaignId, user.id, user, brandConcerns, queryRunner);
      }
      await this.campaignDisputeUseCase.getInstance().checkDisputeEligibility(user);
      await this.ensureNoExistingDispute(campaignId);

      const influencer = await this.userRepository.findUserByInfluencerId(campaign.influencer.id);
      const brand = await this.userRepository.findUserByBrandId(campaign.brand.id);

      if (!influencer || !brand) {
        throw new NotFoundException('Dispute cannot be created: missing opponent user');
      }

      const opponentId = this.getOpponentId(influencer.id, brand.id, user.id);

      const dispute = await this.campaignDisputeRepository.addCampaignDispute(
        {
          status: CampaignDisputeStatus.PENDING,
          is_refund_requested: isRefundRequested,
          campaign_last_status: campaign.status,
          influencer_concerns: influencerConcerns,
          brand_concerns: brandConcerns,
          resolution_action: ResolutionAction.PENDING,
          campaign: { id: campaignId },
          raised_by: { id: user.id },
          against_by: { id: opponentId },
        },
        queryRunner,
      );

      await this.campaignRepository.updateCampaignStatus(campaignId, CampaignStatus.DISPUTED, queryRunner);
      await queryRunner.commitTransaction();
      return dispute;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException({ message: error.message, error: error.error }, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  private async ensureNoExistingDispute(campaignId: number): Promise<void> {
    const existingDispute = await this.campaignDisputeRepository.getOneDisputes({
      where: {
        campaign: { id: campaignId },
        status: In([CampaignDisputeStatus.PENDING, CampaignDisputeStatus.IN_PROGRESS]),
      },
    });

    console.log('Exsisteing Disputes ::: ', existingDispute);
    if (existingDispute) {
      throw new ConflictException('A dispute is already raised for this campaign');
    }
  }

  private getOpponentId(influencerId: number, brandId: number, userId: number): number {
    return influencerId == userId ? brandId : influencerId;
  }

  async updateStatus(userId, campaignId, updateCampaignStatusDto) {
    const { status } = updateCampaignStatusDto;
    const authoriseUser = await this.campaignRepository.isUserAssociatedWithCampaign(campaignId, userId);
    if (!authoriseUser) {
      throw new UnauthorizedException('You are not authorized to access this campaign.');
    }
    const campaign = await this.campaignRepository.findCampaignById(campaignId);

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //checks for brand & influencer access to status
    const statusPermissions = {
      brand: [CampaignStatus.PENDING, CampaignStatus.CONTRACT_SIGNING, CampaignStatus.COMPLETED],
      influencer: [CampaignStatus.ACCEPTED, CampaignStatus.REJECTED, CampaignStatus.IN_PROGRESS, CampaignStatus.PUBLISHING, CampaignStatus.SUBMITTED],
    };

    const roleKey = user.is_brand ? 'brand' : 'influencer';

    if (!statusPermissions[roleKey]?.includes(status)) {
      throw new UnauthorizedException('You are not authorized to make this specific status-change.');
    }

    const latestExhibitDocument = await this.exhibitDocumentUsecase.getInstance().getLatestExhibitDocumentByCampaignId(campaignId);
    const campaignAcceptanceDate = latestExhibitDocument?.campaignAcceptanceDeadline;

    const isCampaignAcceptanceDeadlinePassed = campaignAcceptanceDate && new Date(campaignAcceptanceDate) < new Date();

    if (status === CampaignStatus.ACCEPTED && isCampaignAcceptanceDeadlinePassed) {
      throw new BadRequestException('The campaign acceptance deadline has passed.');
    }

    if (status === CampaignStatus.COMPLETED) {
      campaign.reviewNotifyCount = 1;
    }
    campaign.status = status;

    const updatedCampaign = await this.campaignRepository.save(campaign);
    const latestCampaign = await this.campaignRepository.findCampaignById(campaignId);
    let hasInfluencerReview = false;
    if (latestCampaign!.reviews) {
      hasInfluencerReview = latestCampaign!.reviews.some((review) => review.reviewer_type === 'influencer');
    }

    if (status === CampaignStatus.COMPLETED && !hasInfluencerReview) {
      const notificationData = {
        sender: campaign.brand?.user.id,
        receiver: campaign.influencer?.user.id,
        content: `Please submit review for ${campaign.brand?.user.first_name} ${campaign.brand?.user.last_name} regarding your campaign in ${campaign.segments?.name} segment`,
        type: 'REVIEW',
        sender_type: 'brand',
        receiver_type: 'influencer',
      };
      const res = await this.notificationRepo.create(notificationData);
      if (res) {
        const availableNotifications = await this.notificationRepo.findByNotificationByReceiverId(notificationData.receiver!);
        this.registerSocketEvents('availableNotifications', availableNotifications, `${notificationData.receiver}`);
      }
    }

    return (await { message: 'Campaign status updated successfully.' }) && updatedCampaign;
  }

  async getCampaignUsers(campaignId: number) {
    try {
      const { brandUser, influencerUser } = await this.campaignRepository.getCampaignRelatedBrandAndInfluencerUser(campaignId);

      const sanitizeUser = (user: any): CampaignUsersResponseDto | null => {
        if (!user) return null;
        const { password, refresh_token, ...safeUser } = user; // Exclude sensitive fields
        return safeUser;
      };

      return {
        brandUser: sanitizeUser(brandUser),
        influencerUser: sanitizeUser(influencerUser),
      };
    } catch (error) {
      throw new NotFoundException(`Failed to retrieve users for Campaign ID ${campaignId}`);
    }
  }

  async getCampaignsCountBySegment(segmentId: number) {
    const campaigns = await this.campaignRepository.findActiveBySegmentId(segmentId);
    return campaigns.length;
  }

  async deleteCampaignBySegment(segmentId: number) {
    await this.notificationRepo.deleteByCampaign(segmentId);
    return this.campaignRepository.deleteBySegment(segmentId);
  }
}
