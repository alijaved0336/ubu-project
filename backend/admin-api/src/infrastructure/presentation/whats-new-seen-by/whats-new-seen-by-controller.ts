import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { Controller, Request, Post, Body, UseGuards, ClassSerializerInterceptor, Inject, UseInterceptors } from '@nestjs/common';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import UsecaseProxy, { WHATS_NEW_SEEN_BY_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { WhatsNewSeenByUsecase } from '@use-cases/whats-new-seen-by.usecase';
import { CreateWhatsNewSeenByDto } from './whats-new-seen-by.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('whats_new_seen_by')
@ApiTags('WhatsNewSeenBy')
@ApiBearerAuth()
export class WhatsNewSeenByController {
  constructor(
    @Inject(WHATS_NEW_SEEN_BY_USECASE_PROXY)
    private readonly whatsNewSeenByUsecaseProxy: UsecaseProxy<WhatsNewSeenByUsecase>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new whats new seen by' })
  @ApiResponse({
    status: 201,
    description: 'Whats new seen by created successfully.',
  })
  create(@Request() req: any, @Body() whatsNewSeenByDto: CreateWhatsNewSeenByDto): Promise<any> {
    const userId = req.user.id;
    console.log(userId, '+++++++++++++++++++++++++++++++++++++++++++++++++++');
    return this.whatsNewSeenByUsecaseProxy.getInstance().create(whatsNewSeenByDto, +userId);
  }
}
