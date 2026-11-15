import {
  Controller,
  Inject,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpStatus,
  HttpException,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import UsecaseProxy, { CONTRACT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ContractUsecase } from '@use-cases/contract.usecase';
import { FileSizeInterceptor } from '../UploadFiles/max-file-size.validator';
import { memoryStorage } from 'multer';
import { CreateContractDocumentDto, GetCampaignContractDTO, SubmitContractDTO } from './contract.dto';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

@UseGuards(JwtAuthGuard)
@Controller('contract')
@ApiTags('contract')
@ApiBearerAuth()
export class ContractController {
  constructor(
    @Inject(CONTRACT_USECASE_PROXY)
    private readonly contractUsecaseProxy: UsecaseProxy<ContractUsecase>,
  ) {}

  @Post('upload-signature')
  @ApiOperation({ summary: 'Upload Signature' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Ensures file is available in memory as `file.buffer`
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(new BadRequestException(`Unsupported file type ${file.mimetype}`), false);
        }
        callback(null, true);
      },
    }),
    new FileSizeInterceptor(5 * 1024 * 1024), // 5MB size limit
  )
  async uploadSignature(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    try {
      const result = await this.contractUsecaseProxy.getInstance().uploadSignature(file);
      return {
        statusCode: HttpStatus.OK,
        message: 'File uploaded successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'File upload failed',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create-contract-document')
  @ApiOperation({ summary: 'Create a contract document' })
  @ApiResponse({
    status: 201,
    description: 'Contract Document created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createContractDocument(@Request() req: any, @Body() createContractDocumentDto: CreateContractDocumentDto) {
    console.log(req.user);
    const userId = req.user.id;
    const { brandSignUrl, influencerSignUrl, campaignId } = createContractDocumentDto;
    const documentUrl = await this.contractUsecaseProxy.getInstance().createContractDocument(brandSignUrl, influencerSignUrl, campaignId, userId);

    return { documentUrl };
  }

  @Post('submit-contract')
  @ApiOperation({ summary: 'Send the contract' })
  @ApiResponse({ status: 201, description: 'Contract sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async submitContract(@Request() req: any, @Body() submitContractDTO: SubmitContractDTO) {
    const user = req.user;
    const submittedContract = submitContractDTO;

    const sentContract = await this.contractUsecaseProxy.getInstance().submitContract(submittedContract, user);

    return { sentContract };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract by ID' })
  @ApiResponse({ status: 200, description: 'Contract found successfully.' })
  @ApiResponse({ status: 404, description: 'Contract not found.' })
  async getContractById(@Request() req: any, @Param('id') id: string) {
    const user = req.user;
    const contract = await this.contractUsecaseProxy.getInstance().getContractById(id);

    return contract;
  }

  @Get()
  @ApiOperation({ summary: 'Get the contract' })
  @ApiResponse({ status: 200, description: 'Contract found successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getCampaignContract(@Request() req: any, @Body() getCampaignContractDTO: GetCampaignContractDTO) {
    const user = req.user;
    const { campaignId } = getCampaignContractDTO;

    const contract = await this.contractUsecaseProxy.getInstance().getContractByCampaignId(campaignId);

    return { contract };
  }

  @Get('contract-document/:id')
  @ApiOperation({
    summary: 'Get the contract document based on either campaign or contract document',
  })
  @ApiResponse({
    status: 200,
    description: 'Contract Document found successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getCampaignContractDocumenById(@Request() req: any, @Param('id') id: string) {
    const user = req.user;
    return await this.contractUsecaseProxy.getInstance().getContractDocumentById(Number(id));
  }

  @Get('contract-document/by-campaign/:id')
  @ApiOperation({
    summary: 'Get the contract document based on either campaign or contract document',
  })
  @ApiResponse({
    status: 200,
    description: 'Contract Document found successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getCampaignContractDocumenByCampaignId(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    return await this.contractUsecaseProxy.getInstance().getContractDocumentByCampaignId(Number(id), userId);
  }
}
