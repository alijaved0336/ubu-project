import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(payload: { email: string }, expiresIn: string = '1d'): string {
    const secret = this.getAccessTokenSecret();

    return this.createToken(payload, { secret, expiresIn });
  }

  createRefreshToken(payload: { email: string }, expiresIn: string = ''): string {
    const secret = this.getRefreshTokenSecret();

    return this.createToken(payload, { secret, expiresIn });
  }

  private getAccessTokenSecret(): string {
    return this.configService.get('jwtConfig').accessTokenSecret;
  }

  decodeToken(token: string) {
    const decoded = this.jwtService.decode(token) as { exp?: number };
    if (decoded && decoded.exp) {
      const expiryDate = new Date(decoded.exp * 1000);
      return { expiryDate };
    }
    return { expiryDate: null };
  }

  private getRefreshTokenSecret(): string {
    return this.configService.get('jwtConfig').refreshTokenSecret;
  }

  private createToken(payload: any, options = {}): string {
    return this.jwtService.sign(payload, options);
  }
}
