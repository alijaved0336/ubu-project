import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhatsNewSeenBy } from '../entities/whats-new-seen-by.entity';

@Injectable()
export class WhatsNewSeenByRepository {
  constructor(
    @InjectRepository(WhatsNewSeenBy)
    private readonly whatsNewSeenByRepository: Repository<WhatsNewSeenBy>,
  ) {}

  async create(data: Partial<WhatsNewSeenBy>): Promise<WhatsNewSeenBy> {
    const newWhatsNew = this.whatsNewSeenByRepository.create(data);
    return await this.whatsNewSeenByRepository.save(newWhatsNew);
  }

  async createMultiple(data: Partial<WhatsNewSeenBy>[]): Promise<WhatsNewSeenBy[]> {
    const newWhatsNews = this.whatsNewSeenByRepository.create(data);
    return await this.whatsNewSeenByRepository.save(newWhatsNews);
  }
}
