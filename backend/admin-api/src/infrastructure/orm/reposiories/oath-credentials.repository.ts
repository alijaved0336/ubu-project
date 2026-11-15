import { Repository } from 'typeorm';
import { OAuthCredentials } from '../entities/oauth-credentials.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuthCredentialsRepository {
  constructor(
    @InjectRepository(OAuthCredentials)
    private readonly oAuthCredentials: Repository<OAuthCredentials>,
  ) {}

  async create(payload) {
    // Create an instance of the entity
    const created_data = this.oAuthCredentials.create(payload);

    // Save the created entity to the database
    return await this.oAuthCredentials.save(created_data);
  }

  async saveObject(object) {
    return await this.oAuthCredentials.save(object);
  }

  async findOneByBrandId(brandId: number) {
    // Use the findOne method to fetch the credentials by brand ID
    return await this.oAuthCredentials.findOne({
      where: {
        brand: {
          id: brandId,
        },
      },
    });
  }

  async getFirstRecord(): Promise<OAuthCredentials | null> {
    const records = await this.oAuthCredentials.find({
      order: {
        id: 'ASC',
      },
      take: 1,
    });
    return records[0] || null;
  }
}
