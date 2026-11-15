import { AbstractUsecase } from './abstract.usecase';
import { UserErrorRepository } from '@infrastructure/orm/reposiories/user-error.repository';

export class UserErrorUsecase extends AbstractUsecase<any> {
  constructor(userErrorRepository: UserErrorRepository) {
    super(userErrorRepository);
  }
}
