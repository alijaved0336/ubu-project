import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhatsNew } from '../entities/whats-new.entity';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class WhatsNewRepository extends AbstractRepository<WhatsNew> {
  constructor(
    @InjectRepository(WhatsNew)
    readonly whatsNewRepository: Repository<WhatsNew>,
  ) {
    super(whatsNewRepository);
  }
}
