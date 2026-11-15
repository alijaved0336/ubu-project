import { Injectable } from '@nestjs/common';
import { Tags } from '../entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITagRepository } from '@domain/repository/tag.repository.interface';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class TagRepository extends AbstractRepository<Tags> implements ITagRepository {
  constructor(
    @InjectRepository(Tags)
    readonly tagRepository: Repository<Tags>,
  ) {
    super(tagRepository);
  }
}
