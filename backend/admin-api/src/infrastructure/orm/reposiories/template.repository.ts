// template.repository.ts
import { Repository } from 'typeorm';
import { ITemplateRepository } from '@domain/repository/template.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from '../entities/template.entity';

export class TemplateRepository implements ITemplateRepository {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  async findByTitle(title: string): Promise<Template | null> {
    return this.templateRepository.findOne({ where: { title } });
  }

  async findAllWithContent(): Promise<Template[]> {
    return this.templateRepository.createQueryBuilder('template').where('template.content IS NOT NULL').getMany();
  }

  async findOne(id: number): Promise<Template | null> {
    return this.templateRepository.findOne({ where: { id } });
  }

  async saveTemplate(template: Template): Promise<Template> {
    return await this.templateRepository.save(template);
  }
}
