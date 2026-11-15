import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthUsecase } from '@use-cases/auth.usecase';
import UsecaseProxy, { AUTH_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AUTH_USECASE_PROXY)
    private readonly authUsecaseProxy: UsecaseProxy<AuthUsecase>,
    private readonly configService: ConfigService,
  ) {
    const secretOrKey = configService.get('jwtConfig').accessTokenSecret;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.authUsecaseProxy.getInstance().validateUserForLocalStrategy(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
