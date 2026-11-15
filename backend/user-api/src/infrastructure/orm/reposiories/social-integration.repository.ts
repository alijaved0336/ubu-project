import { Repository, UpdateResult, DeleteResult, LessThan } from 'typeorm';
import { SocialIntegration } from "../entities/social-integration.entity";
import { ISocialIntegrationRepository } from "@domain/repository/social-integration.repository.interface"
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class SocialIntegrationRepository implements ISocialIntegrationRepository {

  constructor(
    @InjectRepository(SocialIntegration)
    private readonly socialIntegrationRepository: Repository<SocialIntegration>
  ) {}  
  async findById(id: number): Promise<Partial<SocialIntegration> | null> {
    return this.socialIntegrationRepository.findOne({where:{id}});
  }

  async create(data: Partial<SocialIntegration>): Promise<string> {
    const newIntegration = this.socialIntegrationRepository.create(data);
    return await this.socialIntegrationRepository.save(newIntegration) && 'Integration Successfully Created!'
  }

  async findByUserId(userId: number): Promise<SocialIntegration | null> {
    return this.socialIntegrationRepository.findOne({ where: { user: { id: userId } } });
  }

  async update(id: number, data: Partial<SocialIntegration>): Promise<SocialIntegration | undefined> {
    const existingIntegration = await this.socialIntegrationRepository.findOne({where:{id}});
    if (!existingIntegration) {
      return undefined;
    }
    const updatedIntegration = Object.assign(existingIntegration, data);
    return this.socialIntegrationRepository.save(updatedIntegration);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.socialIntegrationRepository.delete(id);
    return deleteResult.affected === 1;
  }
  async findByPlatformNameAndUserId(platformName: string, userId: number): Promise<SocialIntegration | undefined> {
    const integration = await this.socialIntegrationRepository.findOne({ where: { user: { id: userId }, social_platform_name: platformName } });

    // Handle the case where integration is null
    if (!integration) {
      return undefined; // Or you can throw an error, depending on your application's logic
    }

    return integration;
  }
}
