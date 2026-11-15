import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRequest, RequestStatus } from '../entities/product-request.entity';

@Injectable()
export class ProductRequestRepository {
  constructor(
    @InjectRepository(ProductRequest)
    private readonly repo: Repository<ProductRequest>,
  ) {}


  async findByUser(userId: number) {
    return this.repo
      .createQueryBuilder('request')
      .innerJoinAndSelect('request.profile', 'profile')
      .innerJoinAndSelect('profile.parent_user', 'parent_user')
      .innerJoinAndSelect('profile.child_user', 'child_user')
      .innerJoinAndSelect('request.affiliateProduct', 'affiliateProduct')
      .where('child_user.id = :userId', { userId })
      .orderBy('request.created_at', 'DESC')
      .getMany();
  }

  async findPendingRequest(profileId: number, productId: number) {
    return this.repo.findOne({
      where: { profile: { id: profileId }, affiliateProduct: { id: productId }, status: RequestStatus.PENDING },
      relations: ['profile', 'profile.parent_user', 'profile.child_user']
    });
  }

  async createRequest(payload: Partial<ProductRequest>) {
    const request = this.repo.create(payload);
    return this.repo.save(request);
  }

  async saveRequest(request: ProductRequest) {
    return this.repo.save(request);
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['profile', 'profile.parent_user', 'profile.child_user', 'affiliateProduct'] });
  }


  // async findAll(parentUserId: number) {
  //   return this.repo.find({
  //     relations: ['profile', 'affiliateProduct', 'profile.child_user'],
  //     where: {
  //       profile: {
  //         parent_user_id: parentUserId,
  //       },
  //     },
  //   });
  // }

  async findAll(parentUserId: number) {
    const productRequests = await this.repo.find({
      relations: ['profile', 'affiliateProduct', 'profile.child_user'],
      where: {
        profile: { parent_user_id: parentUserId },
      },
      order: {
        created_at: 'DESC',
      },
    });
  
    const grouped = productRequests.reduce((acc, req) => {
      const profileId = req.profile.id;
  
      if (!acc[profileId]) {
        acc[profileId] = {
          profile: req.profile,
          product_requests: [],
        };
      }
  
      // Clone the request and remove the profile field
      const { profile, ...productRequestWithoutProfile } = req;
  
      acc[profileId].product_requests.push(productRequestWithoutProfile);
  
      return acc;
    }, {});
  
    return Object.values(grouped);
  }
  
  


  async updateRequestStatus(id: number, status: RequestStatus) {
    await this.repo.update(id, { status });
    return this.findById(id);
  }

  async updateStatusBulk(ids: number[], status: RequestStatus, userId) {
    await this.repo.update(ids, { status });
    return this.findAll(userId);
  }


  


}
