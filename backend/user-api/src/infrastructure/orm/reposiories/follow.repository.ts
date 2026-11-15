import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follows } from '../entities/follow.entity';
import { IFollowRepository } from '@domain/repository/follow.interface';

@Injectable()
export class FollowRepository implements IFollowRepository {
  constructor(
    @InjectRepository(Follows)
    private readonly followRepository: Repository<Follows>,
  ) {}

  async isFollowed(followee, follower) {
    return this.followRepository.find({
      where: {
        followee: {
          id: followee,
        },
        follower: {
          id: follower,
        },
      },
    });
  }
  async follow(followee, follower) {
    const newPost = this.followRepository.create({
      follower,
      followee: { id: followee },
    });

    return this.followRepository.save(newPost);
  }

  async unFollow(followee, follower) {
    return this.followRepository.delete({
      followee,
      follower,
    });
  }

  async followed(userId: number) {
    return this.followRepository.find({
      relations: ['followee', 'followee.influencer'],
      where: {
        follower: {
          id: userId,
        },
      },
      select: {
        followee: {
          id: true,
          first_name: true,
          last_name: true,
          influencer: {
            id: true,
            avatar: true,
          },
        },
      },
    });
  }

  async isFollower(followee, follower): Promise<boolean> {
    const follow = await this.followRepository
      .createQueryBuilder('follow')
      .leftJoin('follow.followee', 'followee_user')
      .leftJoin('follow.follower', 'follower_user')
      .where('followee_user.id = :followee', { followee })
      .andWhere('follower_user.id = :follower', { follower })
      .getOne();
    return !!follow;
  }

  async removeFollowers(user_id) {
    return this.followRepository.delete({
      follower: {
        id: user_id,
      },
    });
  }
}
