import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { Controller, Request, Get, UseGuards, ClassSerializerInterceptor, Inject, UseInterceptors, Param } from '@nestjs/common';
import UsecaseProxy, { AFFILIATE_REPORT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AffiliateReportUsecase } from '@use-cases/affiliate-report.usecase';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('affiliate_report')
@ApiTags('AffiliateReport')
@ApiBearerAuth()
export class AffiliateReportController {
  constructor(
    @Inject(AFFILIATE_REPORT_USECASE_PROXY)
    private readonly affiliateReportUsecase: UsecaseProxy<AffiliateReportUsecase>,
  ) {}

  @ApiResponse({ status: 200, description: '' })
  @Get('affiliate-monthly-report')
  async fetchAffiliateResult(@Request() req: any) {
    const userId = req.user.id;
    return await this.affiliateReportUsecase.getInstance().fetchAffiliateGraphsData(userId);
  }

  @ApiResponse({ status: 200, description: '' })
  @Get('affiliate-monthly-report/:userId')
  async fetchAffiliateResultById(@Param('userId') userId: number) {
    return await this.affiliateReportUsecase.getInstance().fetchAffiliateGraphsData(userId);
  }

  @ApiResponse({ status: 200, description: '' })
  @Get('affiliate-transcations')
  async Transcations(@Request() req: any) {
    const userId = req.user.id;
    return await this.affiliateReportUsecase.getInstance().userTranscations(userId);
  }
}
