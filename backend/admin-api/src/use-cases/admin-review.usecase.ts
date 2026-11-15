import { AdminReviewRepository } from '@infrastructure/orm/reposiories/admin-review.repository';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { CreateAdminReviewDto } from '@infrastructure/presentation/review/admin-review.dto';
import { WebSocketProviderService } from '@infrastructure/sockets/web-socket-provider';
import { Server } from 'socket.io';

export class AdminReviewUsecase {
  server: Server;
  constructor(
    private adminReviewRepository: AdminReviewRepository,
    private brandRepository: BrandRepository,
    private influencerRepository: InfluencerRepository,
    private campaignRepository: CampaignRepository,
    private readonly notificationRepo: NotificationRepository,
    private webSocketProvider: WebSocketProviderService,
  ) {}

  private async registerSocketEvents(event: string, data: any, to: any) {
    this.server = this.webSocketProvider.getServerInstance();
    if (!this.server) {
      console.error('Server instance not initialized');
      return;
    }
    try {
      if (to) {
        this.server.to(to).emit(event, data);
      } else {
        this.server.emit(event, data);
      }
    } catch (error) {
      console.error('Error emitting socket event:', error);
    }
  }

  async create(createAdminReviewtDto: CreateAdminReviewDto): Promise<any> {
    await this.adminReviewRepository.create(createAdminReviewtDto);
  }

  async findBrandReviewsByBrandId(id: number) {
    const reviewsInformation = await this.brandRepository.findBrandReviewsByBrandId(id);

    if (!reviewsInformation || !reviewsInformation.reviewsReceived?.length) {
      return {
        reviewsReceived: [],
        totalReviews: 0,
        averageRating: 0,
      };
    }

    const reviewsReceived = reviewsInformation.reviewsReceived;
    const totalReviews = reviewsReceived.length;
    const totalRating = reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;

    return {
      reviewsReceived,
      totalReviews,
      averageRating,
    };
  }

  async findInfluencerReviewsByInfluencerId(id: number) {
    const reviewsInformation = await this.influencerRepository.findInfluencerReviewsByInfluencerId(id);

    if (!reviewsInformation || !reviewsInformation.reviewsReceived?.length) {
      return {
        reviewsReceived: [],
        totalReviews: 0,
        averageRating: 0,
      };
    }

    const reviewsReceived = reviewsInformation.reviewsReceived;
    const totalReviews = reviewsReceived.length;
    const totalRating = reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;

    return {
      reviewsReceived,
      totalReviews,
      averageRating,
    };
  }

  async cronJobSendNotificationToNonReviewingInfluencers() {
    const completedCampaignsWithNoInfluencerReview = await this.campaignRepository.findCompletedCampaignsWithoutInfluencerReview();
    if (completedCampaignsWithNoInfluencerReview.length) {
      for (const currentCampaign of completedCampaignsWithNoInfluencerReview) {
        let notificationData;
        if (currentCampaign.reviewNotifyCount < 4) {
          notificationData = {
            sender: currentCampaign.brand?.user.id,
            receiver: currentCampaign.influencer?.user.id,
            content: `Please submit review for ${currentCampaign.brand?.user.first_name} ${currentCampaign.brand?.user.last_name} regarding your campaign in ${currentCampaign.segments?.name} segment`,
            type: 'REVIEW',
            sender_type: 'brand',
            receiver_type: 'influencer',
          };
        } else {
          notificationData = {
            sender: currentCampaign.brand?.user.id,
            receiver: currentCampaign.influencer?.user.id,
            content: `Please submit your pending reviews, they are as simple as a 5 star review or else you cannot accept campaigns`,
            type: 'REVIEW',
            sender_type: 'brand',
            receiver_type: 'influencer',
          };
        }
        const res = await this.notificationRepo.create(notificationData);
        if (res) {
          const availableNotifications = await this.notificationRepo.findByNotificationByReceiverId(notificationData.receiver!);
          this.registerSocketEvents('availableNotifications', availableNotifications, `${notificationData.receiver}`);
        }
        await this.campaignRepository.update(currentCampaign.id, {
          reviewNotifyCount: currentCampaign.reviewNotifyCount + 1,
        });
      }
    }
  }
}
