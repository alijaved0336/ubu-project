import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IConsumerRepository } from '@domain/repository/consumer.repository.interface';
import { Consumers } from '../entities/consumer.entity';
import { BodyMeasurement } from '../entities/body-measurement.entity';
import { IConsumer } from '@domain/model/consumer.interface';
import { PostFavourites } from '../entities/post-favourites.entity';
import { PostVisits } from '../entities/post-visit.entity';
import { ProductFavourites } from '../entities/product_favourites.entity';
import { FavoriteAffiliateProduct } from '../entities/favorite-affiliate-product.entity';
import { Cart } from '../entities/cart.entity';
import { Reviews } from '../entities/reviews.entity';
import { UserType } from '../entities/questionnaire.entity';

@Injectable()
export class ConsumerRepository implements IConsumerRepository {
  constructor(
    @InjectRepository(Consumers)
    private readonly consumerRepository: Repository<Consumers>,

    @InjectRepository(BodyMeasurement)
    private readonly bodyRepository: Repository<BodyMeasurement>,

    @InjectRepository(PostFavourites)
    private readonly postFavRepository: Repository<PostFavourites>,

    @InjectRepository(PostVisits)
    private readonly postVisitRepository: Repository<PostVisits>,

    @InjectRepository(ProductFavourites)
    private readonly productFavRepository: Repository<ProductFavourites>,

    @InjectRepository(FavoriteAffiliateProduct)
    private readonly favAffiliateRepository: Repository<FavoriteAffiliateProduct>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(Reviews)
    private readonly reviewRepository: Repository<Reviews>,
  ) {}

  async updateById(id: number, payload) {
    return await this.consumerRepository.update(id, payload);
  }

  async updateConsumerData(id: number) {
    const consumer = await this.consumerProfile(id);

    console.log('consumer-answers', consumer?.user?.user_answer);
    const shape = consumer?.user?.user_answer
      ?.find((user_answer) => user_answer?.question?.sr_no === 10)
      ?.selected_options?.map((option) =>
        option.replace(/^[^\w\s]+/, '').trim(),
      )
      .join(', ');
    const gender = consumer?.user?.user_answer
      ?.find((user_answer) => user_answer?.question?.sr_no === 2)
      ?.selected_options?.join(',');
    const styles = consumer?.user?.user_answer
      ?.find((user_answer) => user_answer?.question?.sr_no === 16)
      ?.selected_options?.join(',');
    const complextion = consumer?.user?.user_answer
      ?.find((user_answer) => user_answer?.question?.sr_no === 9)
      ?.selected_options?.join(',');
    const height = consumer?.user?.user_answer
      ?.find((user_answer) => user_answer?.question?.sr_no === 5)
      ?.selected_options?.join(',');

    const data = {
      gender: gender,
      shape: shape,
      complextion: complextion,
      height: height,
    };

    console.log('data---', data);
    return await this.consumerRepository.update(Number(consumer?.id), data);
  }

  async createIfNotExsist(user_id, payload) {
    const consumer = await this.consumerRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
    });
    if (consumer) {
      if (!consumer?.measurement) {
        if (!payload?.measurement?.id) return;
        await this.updateById(consumer.id, {
          measurement: {
            id: payload.measurement.id,
          },
        });
      }
    }
    if (!consumer) {
      const created_consumer = this.consumerRepository.create(payload);
      return (
        (await this.consumerRepository.save(created_consumer)) &&
        created_consumer
      );
    }
    return true;
  }

  async findByUserId(userId: number) {
    return this.consumerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['measurement', 'user'],
    });
  }

  async findBMByConsumerId(id: number) {
    const bm = await this.consumerRepository.findOne({
      where: {   id  },
      relations: ['measurement', 'user'],
      withDeleted: true
    });
    return bm?.measurement
  }

  async findOneWithSelectedAttributes(id: number) {
    const queryBuilder = this.consumerRepository.createQueryBuilder('consumer');

    queryBuilder
      .leftJoinAndSelect('consumer.user', 'user')
      .leftJoinAndSelect('consumer.measurement', 'measurement')
      .leftJoinAndSelect('user.user_answer', 'user_answer')
      .leftJoinAndSelect('user_answer.question', 'question')
      .leftJoinAndSelect('user.parentProfiles', 'profilesOfParentUser')
      .leftJoinAndSelect('user.childProfile', 'profileOfChildUser')
      .where('consumer.id = :id', { id });

    return await queryBuilder.getOne();
  }

  async saveMeasurements(payload) {
    const created_measurement = await this.bodyRepository.create(payload);
    return await this.bodyRepository.save(created_measurement);
  }

  async consumerProfile(id: number): Promise<Consumers | null> {
    const consumer = await this.consumerRepository
      .createQueryBuilder('consumer')
      .leftJoinAndSelect('consumer.user', 'user')
      .leftJoinAndSelect('consumer.measurement', 'measurement')
      .leftJoinAndSelect('user.user_answer', 'user_answer')
      .leftJoinAndSelect('user_answer.question', 'question')
      .where('user.id = :id', { id })
      .getOne();
    return consumer;
  }

  async removeConsumer(consumer_id) {
    return this.consumerRepository.delete({
      id: consumer_id,
    });
  }

  async body_measurment(consumer_id) {
    const bodyMeasurement = await this.bodyRepository.findOne({
      where: { consumer: { id: consumer_id } },
      relations: ['consumer'],
    });
    return bodyMeasurement;
  }

  async removeMeasurments(bodyMeasurement) {
    return this.bodyRepository.remove(bodyMeasurement);
  }

  async deleteConsumerData(consumerId: number): Promise<void> {
    try {
      const deleteIfExists = async (repo: Repository<any>, name: string) => {
        const exists = await repo.findOne({
          where: { consumer: { id: consumerId } },
        });
        if (exists) {
          const result = await repo.delete({ consumer: { id: consumerId } });
          const count = result.affected || 0;
        } else {
          console.log(`No ${name} found for consumer ID ${consumerId}`);
        }
      };

      await deleteIfExists(this.bodyRepository, 'bodies');
      await deleteIfExists(this.postFavRepository, 'post favorites');
      await deleteIfExists(this.postVisitRepository, 'post visits');
      await deleteIfExists(this.productFavRepository, 'product favorites');
      await deleteIfExists(this.favAffiliateRepository, 'affiliate favorites');
      await deleteIfExists(this.cartRepository, 'cart items');
    } catch (error) {
      console.log('err ===== >', error);
      throw new Error(
        `Failed to delete data for consumer ID ${consumerId}: ${error.message}`,
      );
    }
  }

  async softDeleteConsumerData(consumerId: number): Promise<void> {
    try {
      const deleteIfExists = async (repo: Repository<any>, name: string) => {
        const exists = await repo.findOne({
          where: { consumer: { id: consumerId } },
        });
        console.log('---deletedIfExist---', name, exists)
        if (exists) {
          const result = await repo.softDelete({
            consumer: { id: consumerId },
          });
          const count = result.affected || 0;
        } else {
          console.log(`No ${name} found for consumer ID ${consumerId}`);
        }
      };

      // await deleteIfExists(this.bodyRepository, 'bodies');
      await deleteIfExists(this.postFavRepository, 'post favorites');
      await deleteIfExists(this.postVisitRepository, 'post visits');
      await deleteIfExists(this.productFavRepository, 'product favorites');
      await deleteIfExists(this.favAffiliateRepository, 'affiliate favorites');
      await deleteIfExists(this.cartRepository, 'cart items');
    } catch (error) {
      throw new Error(
        `Failed to delete data for consumer ID ${consumerId}: ${error.message}`,
      );
    }
  }

  async softDeleteBodyMeasurmentByBmId(id: number) {
    return this.bodyRepository.softDelete({id})
  }

  async hardDeleteBodyMeasurmentByBmId(id: number) {
    return this.bodyRepository.delete({id})
  }

  async restoreSoftDeleteConsumerData(consumerId: number): Promise<void> {
    try {
      const restoreIfExists = async (repo: Repository<any>, name: string) => {
        // Check if soft-deleted records exist
        const softDeletedRecords = await repo.find({
          where: { consumer: { id: consumerId } },
          withDeleted: true, // Include soft-deleted records
        });

        console.log('----soft deleted ---',name, softDeletedRecords, )

        if (softDeletedRecords && softDeletedRecords.length > 0) {
          const result = await repo.restore({ consumer: { id: consumerId } });
          const count = result.affected || 0;
          console.log(
            `Restored ${count} ${name} for consumer ID ${consumerId}`,
          );
        } else {
          console.log(
            `No soft-deleted ${name} found for consumer ID ${consumerId}`,
          );
        }
      };

      await restoreIfExists(this.cartRepository, 'cart items');
      await restoreIfExists(this.favAffiliateRepository, 'affiliate favorites');
      await restoreIfExists(this.productFavRepository, 'product favorites');
      await restoreIfExists(this.postVisitRepository, 'post visits');
      await restoreIfExists(this.postFavRepository, 'post favorites');
      // await restoreIfExists(this.bodyRepository, 'bodies');
    } catch (error) {
      throw new Error(
        `Failed to revert data for consumer ID ${consumerId}: ${error.message}`,
      );
    }
  }

  async restoreSoftDeleteBodyMeasurmentByBmId(id: number) {
    return this.bodyRepository.restore({id})
  }
  async restoreConsumerById(consumerId: number){
    return this.consumerRepository.restore({id: consumerId})
  }
  async softDeleteConsumerById(consumerId: number){
    return this.consumerRepository.softDelete({id: consumerId})
  }

  async hardDeleteConsumerById(id: number){
    return this.consumerRepository.delete({id})
  }
}
