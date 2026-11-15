import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Affiliate, Status } from '../entities/affiliate.entity';

@Injectable()
export class AffliateRepository {
  constructor(
    @InjectRepository(Affiliate)
    private readonly affliateRepo: Repository<Affiliate>,
  ) {}

  async create(payload: Partial<Affiliate>[]) {
    await this.affliateRepo.save(payload);
  }

  async findAndAssignAffiliate(brandId: number | null, influencerId: number) {
    try {
      // Find an affiliate where brand_id is null, influencer_id is null, and status is 'in progress'
      const affiliate = await this.affliateRepo.findOne({
        where: {
          brand_id: IsNull(),
          influencer_id: IsNull(),
          status: Status.IN_PROGRESS, // Use the enum value here instead of a string
        },
      });

      // If no affiliate is found, return null
      if (!affiliate) {
        return null;
      }

      // Update the affiliate with the provided influencer_id, brand_id, and status 'completed'
      affiliate.influencer_id = influencerId;
      if (brandId !== null) {
        affiliate.brand_id = brandId; // Only assigns if brandId is not null
      }
      affiliate.status = Status.COMPLETED;

      // Save the updated affiliate record
      await this.affliateRepo.save(affiliate);

      // Return the updated affiliate
      return affiliate.affiliate_id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAffiliateById(affiliate_id: string): Promise<Affiliate | null> {
    // Fetch the record using TypeORM's repository method
    const affiliate = await this.affliateRepo.findOne({
      where: { affiliate_id },
      relations: ['brand', 'influencer'], // Include relations if needed
    });

    if (!affiliate) {
      throw new Error(`No affiliate found with affiliate_id: ${affiliate_id}`);
    }

    return affiliate;
  }
}
