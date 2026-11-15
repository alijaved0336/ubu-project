import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10;
  private readonly encryptionKey = 'ubu-ip-encrypt';
  private readonly ivLength = 16;
  private deriveKey(): Buffer {
    return scryptSync(this.encryptionKey, 'salt', 32);
  }
  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async encryptRefreshToken(token: string): Promise<string> {
    return bcrypt.hash(token, this.saltRounds);
  }

  async encrypt(text: string): Promise<string> {
    const iv = randomBytes(this.ivLength);
    const key = this.deriveKey();
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  async decrypt(encryptedText: string): Promise<string> {
    const [ivHex, encryptedDataHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedData = Buffer.from(encryptedDataHex, 'hex');
    const key = this.deriveKey();
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  async compareRefreshToken(token: string, encryptedToken?: string): Promise<boolean> {
    return bcrypt.compare(token, encryptedToken);
  }

  async comparePassword(password: string, encryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }
}
