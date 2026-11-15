import { FollowRepository } from '@infrastructure/orm/reposiories/follow.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class FollowUsecase {
  constructor(
    private followRepository: FollowRepository,
    private userRepository: UserRepository,
    private notificationRepo: NotificationRepository,
  ) {}

  async follow(followee_influencer_id: number, follower_id: number) {
    const followeeUser = await this.userRepository.findUserByInfluencerId(
      followee_influencer_id,
    );
    const isFollowerExist = await this.userRepository.findById(follower_id);
    if (!followeeUser || !isFollowerExist) {
      throw new NotFoundException('Followee or Follower does not exist');
    }
    const isFollowed = await this.followRepository.isFollowed(
      followee_influencer_id,
      follower_id,
    );
    if (isFollowed.length) {
      throw new BadRequestException('already followed');
    }
    await this.notificationRepo.sendNotificationToUserDevices({
      receiverUserId: followeeUser.id,
      receiverUserType: 'user',
      senderUserId: isFollowerExist.id,
      senderUserType: 'user',
      title: 'New Follower',
      body: `${isFollowerExist.first_name || 'Someone'} started following you.`,
      content: `${isFollowerExist.first_name || 'Someone'} started following you.`,
      type: 'follow',
    });

    return this.followRepository.follow(followeeUser.id, follower_id);
  }

  async unFollow(followee_id: number, follower_id: number) {
    const followeeUser =
      await this.userRepository.findUserByInfluencerId(followee_id);
    if (!followeeUser) {
      throw new NotFoundException('Followee or Follower does not exist');
    }
    return this.followRepository.unFollow(followeeUser.id, follower_id);
  }

  async getFollowedInfluencers(userId: number) {
    try {
      console.log('User Id is ::: ', userId);
      const followedUsers = await this.followRepository.followed(userId);

      return followedUsers
        .map((followed) => {
          const influencer = followed.followee?.influencer;
          if (!influencer) return null;

          return {
            user_id: followed.followee.id,
            influencer_id: influencer.id,
            first_name: followed.followee.first_name,
            last_name: followed.followee.last_name,
            avatar: followed?.followee?.influencer?.avatar,
          };
        })
        .filter(Boolean); // Removes any null or undefined values
    } catch (error) {
      console.error('Error fetching followed influencers:', error);
      throw new Error(
        'Unable to fetch followed influencers. Please try again later.',
      );
    }
  }
}
