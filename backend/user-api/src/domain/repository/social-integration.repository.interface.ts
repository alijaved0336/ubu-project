import { ISocialIntegration } from '@domain/model/social-integration.interface';

export interface ISocialIntegrationRepository {
  findById(id: number): Promise<Partial<ISocialIntegration> | null>;
  create(data: Partial<ISocialIntegration>): Promise<string>;
  findByUserId(userId: number): Promise<ISocialIntegration | null>;
  update(id: number, data: Partial<ISocialIntegration>): Promise<ISocialIntegration | undefined>;
  delete(id: number): Promise<boolean>;
  findByPlatformNameAndUserId(platformName: string, userId: number): Promise<ISocialIntegration | undefined>;
}
