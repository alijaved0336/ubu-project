import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { ProfileUseCase } from '@use-cases/profile.usecase';

import { UserUsecase } from '@use-cases/user.usecase';
import UsecaseProxy, { AUTH_USECASE_PROXY, PROFILE_USECASE_PROXY, USER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function ProfileUsecaseProvider() {
  return {
    inject: [ProfileRepository, AUTH_USECASE_PROXY, UserRepository, USER_USECASE_PROXY],
    provide: PROFILE_USECASE_PROXY,
    useFactory: (
      profileRepository: ProfileRepository,
      authUsecaseProxy: UsecaseProxy<AuthUsecase>,
      userRepository: UserRepository,
      userUsecaseProxy: UsecaseProxy<UserUsecase>,
    ) => new UsecaseProxy(new ProfileUseCase(profileRepository, authUsecaseProxy, userRepository, userUsecaseProxy)),
  };
}
