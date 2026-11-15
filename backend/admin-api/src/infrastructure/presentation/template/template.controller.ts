import { Controller, Inject, Post, Get, Param } from '@nestjs/common';
import { TemplateUsecase } from '@use-cases/template.usecase';
import UsecaseProxy, { TEMPLATE_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { FindTemplateDTO } from './template.dto';

@Controller('template')
export class TemplateController {
  constructor(
    @Inject(TEMPLATE_USECASE_PROXY)
    private readonly templateUsecaseProxy: UsecaseProxy<TemplateUsecase>,
  ) {}

  @Post('create')
  async createTemplate() {
    const newTemplate = await this.templateUsecaseProxy.getInstance().createTemplate();
    return {
      message: 'Template created successfully',
      template: newTemplate,
    };
  }

  @Get(":id")
  async findTemplateById(@Param() params: FindTemplateDTO) {
    const template = await this.templateUsecaseProxy.getInstance().findOne(params.id);
    if (template) {
      return {
        message: 'Template found successfully',
        template: template,
      };
    } else {
      return {
        message: 'Template not found',
      };
    }
  }
}
