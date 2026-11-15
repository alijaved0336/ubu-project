import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { NOTIFICATION_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationUsecase } from '@use-cases/notification.usecase';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_USECASE_PROXY)
    private readonly NotificationUsecaseProxy: UsecaseProxy<NotificationUsecase>,
  ) {}

  @Post('register-device')
  async registerDevice(@Body() body: { userId: number; deviceToken: string }) {
    return this.NotificationUsecaseProxy.getInstance().registerDevice(body.userId, body.deviceToken);
  }

  @Get()
  async findAll(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 3;
    return this.NotificationUsecaseProxy.getInstance().findAll(req?.user?.id, pageNumber, limitNumber, search);
  }
}
