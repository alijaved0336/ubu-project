import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactUs } from '../entities/contact-us-form.entity';

@Injectable()
export class ContactUsRepository {
  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepository: Repository<ContactUs>,
  ) {}

  async create(payload: Partial<ContactUs>): Promise<ContactUs> {
    const contact_us = this.contactUsRepository.create(payload);

    return (await this.contactUsRepository.save(contact_us)) && contact_us;
  }
}
