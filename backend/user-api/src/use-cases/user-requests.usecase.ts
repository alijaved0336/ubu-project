import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserRequestsRepository } from '@infrastructure/orm/reposiories/user-requests.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import {
  RequestFor,
  RequestStatus,
} from '@infrastructure/orm/entities/user-requests.entity';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { RelationType } from '@infrastructure/orm/entities/profile.entity';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

@Injectable()
export class UserRequestsUsecase {
  constructor(
    private readonly userRequestsRepository: UserRequestsRepository,
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly notificationRepo: NotificationRepository,
  ) {}

  async haveAnyRelation(
    requesterId: number,
    requesteeId: number,
    requestFor: RequestFor,
  ) {
    const requesterIsChild =
      await this.profileRepository.isChildUser(requesterId);
    const requesteeIsChild =
      await this.profileRepository.isChildUser(requesteeId);

    const requesterChildCount =
      await this.profileRepository.countActiveProfilesByParentId(requesterId);
    const requesteeChildCount =
      await this.profileRepository.countActiveProfilesByParentId(requesteeId);

    if (requestFor === RequestFor.PARENT) {
      if (requesteeIsChild) {
        throw new BadRequestException(
          'Requestee is already a child of another user.',
        );
      }

      if (requesteeChildCount > 0) {
        throw new BadRequestException('Requestee is already a parent.');
      }

      if (requesterIsChild) {
        throw new BadRequestException(
          'Requester is already a child and cannot become a parent.',
        );
      }

      if (requesterChildCount >= 5) {
        throw new BadRequestException(
          'Requester already has 5 children and cannot add more.',
        );
      }
    }

    if (requestFor === RequestFor.CHILD) {
      if (requesteeIsChild) {
        throw new BadRequestException('Requestee is already a child.');
      }

      if (requesteeChildCount >= 5) {
        throw new BadRequestException('Requestee already has 5 children.');
      }

      if (requesterIsChild) {
        throw new BadRequestException('Requester is already a child.');
      }

      if (requesterChildCount > 0) {
        throw new BadRequestException('Requester is already a parent.');
      }
    }
  }

  async sendRequest(
    requesterId: number,
    requesteeId: number,
    relationType: RelationType,
    requestFor: RequestFor,
  ) {
    await this.haveAnyRelation(requesterId, requesteeId, requestFor);

    const requester = await this.userRepository.findById(requesterId);
    const requestee = await this.userRepository.findById(requesteeId);
    console.log('requesteerequestee', requestee);
    if (!requester || !requestee) {
      throw new NotFoundException('Requester or Requestee user not found');
    }

    const existingRequest =
      await this.userRequestsRepository.findExistingRequest(
        requesterId,
        requesteeId,
        relationType,
      );

    if (existingRequest) {
      throw new BadRequestException('Request already exists');
    }
    await this.notificationRepo.sendNotificationToUserDevices({
      receiverUserId: requesteeId,
      receiverUserType: 'user',
      senderUserId: requesterId,
      senderUserType: 'user',
      title: 'New Relationship Request',
      body: 'You have received a new request.',
      content: 'You have received a new relationship request.',
      type: 'request-created',
      saveToDatabase: true, // optional, true by default
    });

    return this.userRequestsRepository.createRequest({
      requester,
      requestee,
      relationType,
      requestFor,
      status: RequestStatus.PENDING,
    });
  }

  async cancelRequest(
    requesterId: number,
    requesteeId: number,
    relationType: RelationType,
  ) {
    const result = await this.userRequestsRepository.deleteRequest(
      requesterId,
      requesteeId,
      relationType,
    );

    if (!result.affected) {
      throw new NotFoundException('Request not found to cancel');
    }

    return { success: true };
  }

  async getPendingRequestsForUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.userRequestsRepository.getPendingRequests(userId);
  }

  async respondToRequest(requestId: number, action: 'accept' | 'reject') {
    const request = await this.userRequestsRepository.findById(requestId);
    if (!request) throw new NotFoundException('Request not found');

    await this.haveAnyRelation(
      request?.requester_id,
      request?.requestee_id,
      request?.requestFor,
    );

    const status =
      action === 'accept' ? RequestStatus.ACCEPTED : RequestStatus.REJECTED;
    const profileData = {
      relation: request.relationType,
      is_active: true,
      isDependant: false,
      parent_user_id:
        request.requestFor === 'Parent'
          ? request?.requester_id
          : request?.requestee_id,

      child_user_id:
        request.requestFor === 'Parent'
          ? request?.requestee_id
          : request?.requester_id,
    };
    if (status === RequestStatus.ACCEPTED) {
      await this.profileRepository.deleteByChildUserId(
        profileData.child_user_id,
      );
      await this.profileRepository.create(profileData);
    }

    await this.notificationRepo.sendNotificationToUserDevices({
      receiverUserId: request.requester_id,
      receiverUserType: 'user',
      senderUserId: request.requestee_id,
      senderUserType: 'user',
      title: 'Request Update',
      body:
        action === 'accept'
          ? 'Your request has been accepted.'
          : 'Your request has been rejected.',
      content:
        action === 'accept'
          ? 'Your request has been accepted.'
          : 'Your request has been rejected.',
      type: 'request-response',
    });

    return this.userRequestsRepository.updateStatus(requestId, status);
  }

  async getRequestsByRequesterId(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.userRequestsRepository.findRequestsByRequesterId(userId);
  }

  async getRequestsByRequesteeId(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.userRequestsRepository.findRequestsByRequesteeId(userId);
  }
}
