import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { RequestStatus } from '../infrastructure/orm/entities/product-request.entity';
import { ProductRequestRepository } from '@infrastructure/orm/reposiories/product-request.repository';
import {
  BulkUpdateProductRequestStatusDto,
  UpdateProductRequestStatusDto,
} from '@infrastructure/presentation/product-request/product-request.dto';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

@Injectable()
export class ProductRequestUsecase {
  constructor(
    private readonly productRequestRepository: ProductRequestRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly notificationRepo: NotificationRepository, // ✅ Inject notification repo
  ) {}

  async fetchByUser(userId: number) {
    const isChildUser = await this.profileRepository.isChildUser(userId);
    if (isChildUser) {
      return this.productRequestRepository.findByUser(userId);
    } else {
      return this.productRequestRepository.findAll(userId);
    }
  }

  async create(userId: number, payload) {
    const profile = await this.profileRepository.findByChildUserId(userId);
    if (!profile) {
      throw new NotFoundException(
        'Profile Not Found. Please contact support or verify if you are logged in using a child profile.',
      );
    }

    const existing = await this.productRequestRepository.findPendingRequest(
      profile.id,
      payload.product_id,
    );
    const isChildUser = await this.profileRepository.isChildUser(userId);

    if (!isChildUser) {
      throw new ForbiddenException(
        'Primary User is not allowed to create the request.',
      );
    }

    if (existing) {
      if (existing.profile.child_user_id !== userId) {
        throw new ForbiddenException(
          'You are not allowed to modify this request.',
        );
      }
      existing.quantity += payload.quantity;
      existing.message = existing.message
        ? `${existing.message}. ${payload?.message}`
        : payload?.message;
      return this.productRequestRepository.saveRequest(existing);
    }

    const newRequest = await this.productRequestRepository.createRequest({
      affiliateProduct: { id: Number(payload.product_id) } as any,
      profile: { id: profile.id, child_user_id: userId } as any,
      quantity: payload.quantity,
      message: payload?.message || '',
      status: RequestStatus.PENDING,
    });

    const parentId = profile.parent_user_id;
    await this.notificationRepo.sendNotificationToUserDevices({
      receiverUserId: parentId,
      receiverUserType: 'user',
      senderUserId: userId,
      senderUserType: 'user',
      title: 'New Product Request',
      body: 'You have a new product request from your child.',
      content: 'New product request created.',
      type: 'product-request',
    });

    return newRequest;
  }

  async updateStatus(
    userId: number,
    updateProductRequestStatusDto: UpdateProductRequestStatusDto,
  ) {
    const request = await this.productRequestRepository.findById(
      updateProductRequestStatusDto.requestId,
    );
    if (!request) throw new NotFoundException('Request not found.');

    if (request.profile.parent_user_id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this request.',
      );
    }

    const updated = await this.productRequestRepository.updateRequestStatus(
      updateProductRequestStatusDto.requestId,
      updateProductRequestStatusDto.status as RequestStatus,
    );

    const childId = request.profile.child_user_id;
    if (!childId) throw new ForbiddenException('child user not found.');

    const statusMessage =
      updateProductRequestStatusDto.status === RequestStatus.APPROVED
        ? 'approved'
        : 'rejected';

    await this.notificationRepo.sendNotificationToUserDevices({
      receiverUserId: childId,
      receiverUserType: 'user',
      senderUserId: userId,
      senderUserType: 'user',
      title: 'Product Request Update',
      body: `Your product request has been ${statusMessage}.`,
      content: `Your product request has been ${statusMessage}.`,
      type: 'product-request-response',
    });

    return updated;
  }

  async updateStatusBulk(
    userId: number,
    bulkUpdateProductRequestStatusDto: BulkUpdateProductRequestStatusDto,
  ) {
    const requests = await Promise.all(
      bulkUpdateProductRequestStatusDto.requestIds.map((id) =>
        this.productRequestRepository.findById(Number(id)),
      ),
    );

    for (const request of requests) {
      if (!request)
        throw new NotFoundException('One or more requests not found.');
      if (request.profile.parent_user_id !== userId) {
        throw new ForbiddenException(
          'You are not allowed to update one or more of these requests.',
        );
      }

      const childId = request.profile.child_user_id;
      if (!childId) throw new ForbiddenException('child user not found.');

      await this.notificationRepo.sendNotificationToUserDevices({
        receiverUserId: childId,
        receiverUserType: 'user',
        senderUserId: userId,
        senderUserType: 'user',
        title: 'Product Request Update',
        body: `Your product request has been ${
          bulkUpdateProductRequestStatusDto.status === RequestStatus.APPROVED
            ? 'approved'
            : 'rejected'
        }.`,
        content: `Your product request has been ${
          bulkUpdateProductRequestStatusDto.status === RequestStatus.APPROVED
            ? 'approved'
            : 'rejected'
        }.`,
        type: 'product-request-response',
      });
    }

    return this.productRequestRepository.updateStatusBulk(
      bulkUpdateProductRequestStatusDto.requestIds.map((id) => Number(id)),
      bulkUpdateProductRequestStatusDto.status as RequestStatus,
      userId,
    );
  }
}
