import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRequest, RequestStatus } from '../entities/user-requests.entity';
import { RelationType } from '../entities/profile.entity';

@Injectable()
export class UserRequestsRepository extends Repository<UserRequest> {
  constructor(private dataSource: DataSource) {
    super(UserRequest, dataSource.createEntityManager());
  }

  async createRequest(data: Partial<UserRequest>) {
    const request = this.create(data);
    return this.save(request);
  }

  async updateStatus(id: number, status: RequestStatus) {
    return this.update(id, { status });
  }

  async getPendingRequests(userId: number) {
    return this.find({
      where: { requestee: { id: userId }, status: RequestStatus.PENDING },
      relations: ['requester', 'requestee'],
    });
  }

  async deleteRequest(
    requesterId: number,
    requesteeId: number,
    relationType: RelationType,
  ) {
    return this.softDelete({
      requester: { id: requesterId },
      requestee: { id: requesteeId },
      relationType,
    });
  }

  async findExistingRequest(
    requesterId: number,
    requesteeId: number,
    relationType: RelationType,
  ) {
    return this.findOne({
      where: {
        requester: { id: requesterId },
        requestee: { id: requesteeId },
        relationType,
      },
    });
  }

  async findById(id: number) {
    return this.findOne({
      where: { id },
      relations: ['requester', 'requestee'],
    });
  }

  async findRequestsByRequesterId(requesterId: number) {
    return this.find({
      where: { requester: { id: requesterId } },
      relations: [
        'requester',
        'requester.consumer',
        'requester.influencer',
        'requestee',
        'requestee.consumer',
        'requestee.influencer',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findRequestsByRequesteeId(requesteeId: number) {
    return this.find({
      where: { requestee: { id: requesteeId } },
      relations: [
        'requester',
        'requester.consumer',
        'requester.influencer',
        'requestee',
        'requestee.consumer',
        'requestee.influencer',
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
