import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async encryptRefreshToken(token: string): Promise<string> {
    return bcrypt.hash(token, this.saltRounds);
  }

  async compareRefreshToken(
    token: string,
    encryptedToken?: string,
  ): Promise<boolean> {
    return bcrypt.compare(token, encryptedToken);
  }

  async comparePassword(
    password: string,
    encryptedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword)
  }
}
