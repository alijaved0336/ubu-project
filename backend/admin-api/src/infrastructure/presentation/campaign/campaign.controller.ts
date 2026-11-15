import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  Controller,
  Post,
  Body,
  Inject,
  Request,
  UseGuards,
  Get,
  Param,
  Put,
  Query,
  Patch,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import UsecaseProxy, { CAMPAIGN_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { CampaignUsecase } from '@use-cases/campaign.usecase';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateDocumentDto, CreateCampaignDto, CreateCampaignWithDocumentDto, UpdateCampaignStatusDto, CreateDisputeDto } from './campaign.dto';
import { ExhibitDocument } from '@infrastructure/orm/entities/exhibit-document.entity';

@UseGuards(JwtAuthGuard)
@Controller('campaign')
@ApiTags('Campaign')
@ApiBearerAuth()
export class CampaignController {
  constructor(
    @Inject(CAMPAIGN_USECASE_PROXY)
    private readonly campaignUsecaseProxy: UsecaseProxy<CampaignUsecase>,
  ) {}

  @Post('create-document')
  @ApiOperation({ summary: 'Create a campaign document' })
  @ApiResponse({ status: 201, description: 'Document created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createDocument(@Request() req: any, @Body() createDocumentDto: CreateDocumentDto) {
    const userId = req.user.id;

    const documentUrl = await this.campaignUsecaseProxy.getInstance().createDocument({
      influencerId: createDocumentDto.influencerId,
      userId,
      campaignName:createDocumentDto.campaignName,
      description: createDocumentDto.description,
      hashtags: createDocumentDto.hashtags || [],
      numberOfDeliverables: createDocumentDto.numberOfDeliverables,
      additionalRequirements: createDocumentDto.additionalRequirements,
      campaignAcceptanceDeadline: createDocumentDto.campaignAcceptanceDeadline,
      publicationDates: createDocumentDto.publicationDates,
      totalCompensation: createDocumentDto.totalCompensation,
      brandGuidelines: createDocumentDto.brandGuidelines,
      revisions: createDocumentDto.revisions,
      specialConditions: createDocumentDto.specialConditions,
      productId: createDocumentDto.productId,
    });

    return { documentUrl };
  }

  @Get()
  async findAll(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 3;
    return this.campaignUsecaseProxy.getInstance().findAll(req.user.id, pageNumber, limitNumber, search);
  }

  @Post('create-campaign')
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createCampaign(
    @Request() req: any,
    @Body() createCampaignWithDocumentDto: CreateCampaignWithDocumentDto, // Ensure this is the correct DTO
  ) {
    const userId = req.user.id;
    const validation = await this.campaignUsecaseProxy.getInstance().isUserEligibleToCreateCampaign(userId);
    /* if (!validation)
    {
      throw new HttpException('Please upgrade yor subscription to send more Campaigns', 403);
    } */
    const { campaign, document } = createCampaignWithDocumentDto;

    const createdCampaign = await this.campaignUsecaseProxy.getInstance().createCampaign({ ...campaign, userId }, document);

    return { createdCampaign };
  }

  @Get(`:id`)
  getRecord(@Param('id') id: number) {
    return this.campaignUsecaseProxy.getInstance().getOneWithLatestDocument(id);
  }

  @Get(`users/:id`)
  getCampaignUsers(@Param('id', ParseIntPipe) id: number) {
    return this.campaignUsecaseProxy.getInstance().getCampaignUsers(id);
  }

  @Put(`:id`)
  @ApiOperation({ summary: 'Edit a campaign' })
  @ApiResponse({ status: 201, description: 'Campaign updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async editCampaign(
    @Request() req: any,
    @Param('id') id: number,
    @Body() createCampaignWithDocumentDto: CreateCampaignWithDocumentDto, // Ensure this is the correct DTO
  ) {
    const userId = req.user.id;

    const { campaign, document } = createCampaignWithDocumentDto;

    const createdCampaign = await this.campaignUsecaseProxy.getInstance().editCampaign({ ...campaign, userId }, document, id);
    return { createdCampaign };
  }

  @Post('create-dispute')
  @ApiOperation({ summary: 'Create a dispute for a campaign.' })
  @ApiResponse({ status: 201, description: 'Dispute successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid dispute request data.' })
  @ApiBody({ type: CreateDisputeDto })
  async createDispute(@Body() body: CreateDisputeDto, @Req() request: any) {
    try {
      const user = request.user;
      const { campaign_id, brand_concerns, influencer_concerns, is_refund_requested } = body;
      const result = await this.campaignUsecaseProxy
        .getInstance()
        .createDispute(user, campaign_id, brand_concerns || '', influencer_concerns || '', is_refund_requested);

      return { message: 'Dispute created successfully.', result };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          error: error.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(`:id/update_status`)
  updateState(@Request() req: any, @Param('id') campaignId: number, @Body() updateCampaignStatusDto: UpdateCampaignStatusDto) {
    const userId = req.user.id;
    return this.campaignUsecaseProxy.getInstance().updateStatus(userId, campaignId, updateCampaignStatusDto);
  }
}
