import { ICampaignDisputeList } from '@domain/interfaces/campaign-dispute.interface';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CampaignDisputeUseCase } from '@use-cases/campaign-dispute.usecase';
import UsecaseProxy, { CAMPAIGN_DISPUTE_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { GetCampaignDisputeDto, ResolveDisputeDto, UpdateCampaignDisputeConcernsDto, UpdateCampaignDisputeStatusDto } from './campaign-dispute.dto';

@ApiTags('CampaignDispute')
@Controller('campaignDispute')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CampaignDisputeController {
  constructor(
    @Inject(CAMPAIGN_DISPUTE_USECASE_PROXY)
    private readonly campaignDisputeUsecaseProxy: UsecaseProxy<CampaignDisputeUseCase>,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Retrieve a list of Disputes' })
  @ApiResponse({
    status: 200,
    description: 'Dispute list retrieved successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to retrieve the dispute list.',
  })
  async getDisputes(@Query() query: GetCampaignDisputeDto, @Req() request: any) {
    const pageNumber = query.page ?? 1;
    const pageSize = query.limit ?? 10;
    const data: ICampaignDisputeList = {
      pageNumber,
      pageSize,
      ...query,
    };
    try {
      const disputes = await this.campaignDisputeUsecaseProxy.getInstance().getDisputesList(data);

      return {
        message: 'Dispute list retrieved successfully.',
        data: { disputes: disputes.disputes, totalCount: disputes.totalCount },
      };
    } catch (error) {
      console.error('Error retrieving dispute list:', error.message);
      throw new HttpException(
        {
          message: 'Failed to retrieve the dispute list.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Only for the Super admin
  @Patch(':campaign_dispute_id/update-status')
  @ApiOperation({ summary: 'Update the status of a campaign dispute.' })
  @ApiResponse({
    status: 200,
    description: 'Dispute status updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to update the dispute status.',
  })
  @ApiParam({
    name: 'campaign_dispute_id',
    description: 'The ID of the campaign dispute to update.',
    example: '123',
  })
  @ApiBody({ type: UpdateCampaignDisputeStatusDto })
  async updateCampaignDisputeStatus(@Param('campaign_dispute_id') campaign_dispute_id: string, @Body() body: UpdateCampaignDisputeStatusDto) {
    try {
      const { dispute_status } = body;
      const result = await this.campaignDisputeUsecaseProxy.getInstance().updateDisputeStatus(campaign_dispute_id, dispute_status);

      return {
        message: 'Dispute status updated successfully.',
        data: result,
      };
    } catch (error) {
      console.error('Error updating dispute status:', error.message);
      throw new HttpException(
        {
          message: 'Failed to update the dispute status.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // Only for the Super admin
  @Patch(':campaign_dispute_id/mark-as-resolved')
  @ApiOperation({ summary: 'Resolution of a campaign dispute.' })
  @ApiResponse({
    status: 200,
    description: 'Dispute status updated and resoltion work is done successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to update the dispute and resolution work.',
  })
  @ApiParam({
    name: 'campaign_dispute_id',
    description: 'The ID of the campaign dispute to update.',
    example: '123',
  })
  @ApiBody({ type: ResolveDisputeDto })
  async ResolveCampaignDispute(@Param('campaign_dispute_id') campaign_dispute_id: string, @Body() body: ResolveDisputeDto, @Req() request: any) {
    try {
      const { remarks, resolutionAction } = body;
      const user = request.user;
      const result = await this.campaignDisputeUsecaseProxy.getInstance().resolveDispute(campaign_dispute_id, remarks, resolutionAction, user);

      return {
        message: 'Dispute status updated successfully.',
        data: result,
      };
    } catch (error) {
      console.error('Error updating dispute status:', error.message);
      throw new HttpException(
        {
          message: error.message,
          error: error.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':campaign_dispute_id/update-concerns')
  @ApiOperation({ summary: 'Update the status of a campaign dispute.' })
  @ApiResponse({
    status: 200,
    description: 'Dispute concerns updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to update the dispute concerns.',
  })
  @ApiParam({
    name: 'campaign_dispute_id',
    description: 'The ID of the campaign dispute to update.',
    example: '123',
  })
  @ApiBody({ type: UpdateCampaignDisputeConcernsDto })
  async updateCampaignDisputeConcerns(
    @Param('campaign_dispute_id') campaign_dispute_id: string,
    @Body() body: UpdateCampaignDisputeConcernsDto,
    @Req() request: any,
  ) {
    try {
      const user = request.user;
      const { influencer_concerns, brand_concerns, is_refund_requested } = body;

      const result = await this.campaignDisputeUsecaseProxy
        .getInstance()
        .updateDisputeConcerns(user.id, campaign_dispute_id, influencer_concerns, brand_concerns, is_refund_requested);

      return {
        message: 'Dispute status updated successfully.',
        data: result,
      };
    } catch (error) {
      console.error('Error updating dispute status:', error.message);
      throw new HttpException(
        {
          message: 'Failed to update the dispute status.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
