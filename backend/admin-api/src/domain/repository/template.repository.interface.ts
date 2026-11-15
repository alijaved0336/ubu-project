// template.repository.interface.ts
import { ITemplate } from '@domain/model/template.interface';
import { Repository } from 'typeorm';

export interface ITemplateRepository {
  findByTitle(title: string): Promise<ITemplate | null>;
  findAllWithContent(): Promise<ITemplate[]>;
  findOne(id: number): Promise<ITemplate | null>;
}
