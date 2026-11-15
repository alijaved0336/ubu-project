import { IAuth } from '@domain/model/user.interface';

export class AuthLoginUserPresenter implements IAuth {
  accessToken: string;
  refreshToken: string;
  email: string;

  constructor(partial: Partial<AuthLoginUserPresenter>) {
    Object.assign(this, partial);
  }
}
