import { Injectable } from '@nestjs/common';

@Injectable()
export class BodyGramService {
  async getBodyGramKeys() {
    const BODYGRAM_API_KEY = process.env.BODYGRAM_API_KEY;
    const BODYGRAM_ORGANIZATION_ID = process.env.BODYGRAM_ORGANIZATION_ID;
    return { BODYGRAM_API_KEY, BODYGRAM_ORGANIZATION_ID };
  }
}
