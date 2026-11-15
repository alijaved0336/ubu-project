import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from '../infrastructure/orm/entities/template.entity';
import { TemplateRepository } from '@infrastructure/orm/reposiories/template.repository';

@Injectable()
export class TemplateUsecase {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: TemplateRepository,
  ) {}

  async createTemplate(): Promise<Template> {
    const template = new Template();
    template.title = 'Campaign Document Preview';
    template.heading = 'Welcome to Our Exclusive Campaign!';
    template.description = 'This campaign offers the best deals for our valued customers.';
    template.signature = 'Best Regards, The Campaign Team';
    template.footer = 'Contact us at support@campaign.com';
    template.content = { customField1: 'Value1', customField2: 'Value2' };

    return await this.templateRepository.saveTemplate(template);
  }

  async findOne(id: number): Promise<Template | null> {
    return await this.templateRepository.findOne(id);
  }
}
