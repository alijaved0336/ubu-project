import { UserErrorUsecase } from '@use-cases/user-error.usecase';
import { UserErrorRepository } from '@infrastructure/orm/reposiories/user-error.repository';
import UsecaseProxy, { USER_ERROR_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function UserErrorUsecaseProvider() {
  return {
    inject: [UserErrorRepository],
    provide: USER_ERROR_USECASE_PROXY,
    useFactory: (userErrorRepository: UserErrorRepository) => new UsecaseProxy(new UserErrorUsecase(userErrorRepository)),
  };
}
