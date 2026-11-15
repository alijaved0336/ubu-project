import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ClassSerializerInterceptor, Controller, Get, Inject, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { SESSION_LOG_ENTRY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SessionLogUseCase } from '@use-cases/sessionlog.usecase';
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('/session_logs')
@ApiTags('Session Logs')
@ApiBearerAuth()
export class SessionLogController {
  constructor(
    @Inject(SESSION_LOG_ENTRY)
    private readonly sessionLogUsecase: UsecaseProxy<SessionLogUseCase>,
  ) {}

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 3;
    return await this.sessionLogUsecase.getInstance().findAll(pageNumber, limitNumber, search);
  }
}
