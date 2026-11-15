import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import UsecaseProxy, { AUTH_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import { SignInMethods } from '@infrastructure/utils/constant';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(AUTH_USECASE_PROXY)
    private readonly authUsecaseProxy: UsecaseProxy<AuthUsecase>,
    private jwtService: JwtService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/google-redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const jwtAccessToken = this.jwtService.createAccessToken({ email: emails[0].value }, '1d');

    const user = {
      email: emails[0].value,
      accessToken: jwtAccessToken,
    };
    await this.authUsecaseProxy.getInstance().registerUser(
      {
        email: user.email,
        first_name: name.givenName ?? user.email.split('@')[0],
        last_name: name.familyName,
        password: '',
        recaptchaToken: 'true',
      },
      SignInMethods.GOOGLE,
      'webApplication',
      true,
    );
    done(null, user);
  }
}
