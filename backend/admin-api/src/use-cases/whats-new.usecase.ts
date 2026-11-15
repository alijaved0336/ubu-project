import { WhatsNewRepository } from '@infrastructure/orm/reposiories/whats-new.repository';

import { AbstractUsecase } from './abstract.usecase';
import { FindOptionsWhere, ILike } from 'typeorm';
import { WhatsNew } from '@infrastructure/orm/entities/whats-new.entity';

export class WhatsNewUsecase extends AbstractUsecase<any> {
  constructor(private whatsNewRepository: WhatsNewRepository) {
    super(whatsNewRepository);
  }

  async findAllByUserIdWithPagination(userId: number, page: number, limit: number, search?: string) {
    let whereCondition: FindOptionsWhere<WhatsNew>[] = [{ user: { id: userId } }];
    if (search) {
      whereCondition = [
        {
          title: ILike(`%${search}%`),
          description: ILike(`%${search}%`),
        },
      ];
    }
    const { result, total } = await super.applyPagination(page, limit, ['user'], whereCondition, { updated_at: 'DESC' });
    return { whatsNew: result, total };
  }

  async findAllWithPagination(page: number, limit: number, search?: string) {
    let whereCondition: FindOptionsWhere<WhatsNew>[] = [];
    if (search) {
      whereCondition = [{ title: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }] as FindOptionsWhere<WhatsNew>[];
    }
    const { result, total } = await super.applyPagination(page, limit, ['user'], whereCondition, { updated_at: 'DESC' });
    return { whatsNew: result, total };
  }

  async customFindAndCount(userId) {
    const allWhatsNew = await this.whatsNewRepository.findAndCount(['user', 'seenBy', 'seenBy.user'], {
      created_at: 'DESC',
    });
    const filteredWhatsNew = allWhatsNew.result.map((item) => {
      const filteredSeenBy = item.seenBy.filter((seen) => seen.user.id === userId);
      return {
        ...item,
        seenBy: filteredSeenBy,
      };
    });
    return { whatsNew: filteredWhatsNew, total: allWhatsNew.total };
  }
}
