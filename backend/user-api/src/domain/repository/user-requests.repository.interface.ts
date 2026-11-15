import { RelationType } from '@infrastructure/orm/entities/profile.entity';

export interface IUserRequestsRepository {
  createRequest(
    requesterId: number,
    requesteeId: number,
    relation: RelationType,
  ): Promise<any>;
  updateStatus(
    requestId: number,
    status: 'pending' | 'accepted' | 'rejected',
  ): Promise<any>;
  getRequestsForUser(userId: number): Promise<any[]>;
  deleteRequest(requestId: number): Promise<void>;
}
