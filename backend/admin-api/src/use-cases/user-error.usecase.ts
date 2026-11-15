import { FindOptionsWhere, ILike } from 'typeorm';
import { AbstractUsecase } from './abstract.usecase';
import { UserError } from '@infrastructure/orm/entities/user-error.entity';
import { PaginationDto } from '@infrastructure/presentation/common/common.dto';
import { UserErrorRepository } from '@infrastructure/orm/reposiories/user-error.repository';

export class UserErrorUsecase extends AbstractUsecase<any> {
  constructor(userErrorRepository: UserErrorRepository) {
    super(userErrorRepository);
  }

  async findAllWithPagination(query: PaginationDto) {
    let whereCondition: FindOptionsWhere<UserError>[] = [];

    if (query.search) {
      whereCondition = [
        { message: ILike(`%${query.search}%`) },
        { user: { first_name: ILike(`%${query.search}%`) } },
        { user: { last_name: ILike(`%${query.search}%`) } },
        {
          user: {
            first_name: ILike(`%${query.search.split(' ')[0]}%`),
            last_name: ILike(`%${query.search.split(' ')[1] || query.search.split(' ')[0]}%`),
          },
        },
      ] as FindOptionsWhere<UserError>[];
    }

    const { result, total } = await super.applyPagination(query.page!, query.limit!, ['user'], whereCondition, { updated_at: 'DESC' });

    return { userErrors: result, total };
  }
}
