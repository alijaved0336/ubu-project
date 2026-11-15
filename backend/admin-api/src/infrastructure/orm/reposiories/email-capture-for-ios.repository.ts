import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailCapturedForIOS } from '../entities/email-captured-form.entity';

@Injectable()
export class EmailCapturedForIOSRepository {
  constructor(
    @InjectRepository(EmailCapturedForIOS)
    private readonly emailCaptureForIOSRepository: Repository<EmailCapturedForIOS>,
  ) {}

  async create(payload: Partial<EmailCapturedForIOS>): Promise<EmailCapturedForIOS> {
    const res = this.emailCaptureForIOSRepository.create(payload);

    return (await this.emailCaptureForIOSRepository.save(res)) && res;
  }
}
