import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { Controller, Post, Body, Inject, UseGuards, Get, Param } from '@nestjs/common';
import UsecaseProxy, { EXHIBITDOCUMENT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ExhibitDocumentUsecase } from '@use-cases/exhibit-document.usecase';

@UseGuards(JwtAuthGuard)
@Controller('exhibit_document')
export class ExhibitDocumentController {
  constructor(
    @Inject(EXHIBITDOCUMENT_USECASE_PROXY)
    private readonly exhibitUsecaseProxy: UsecaseProxy<ExhibitDocumentUsecase>,
  ) {}

  @Post(`:id/getHistoryData`)
  async getHistoryData(@Body() body, @Param('id') id) {
    return this.exhibitUsecaseProxy.getInstance().getHistoryData(id, body);
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    return this.exhibitUsecaseProxy.getInstance().findOne(id);
  }
}
