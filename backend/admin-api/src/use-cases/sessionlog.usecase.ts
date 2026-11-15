import { SessionLogRepository } from '@infrastructure/orm/reposiories/sessionlog.repository';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';

const _ = require('lodash');

export class SessionLogUseCase {
  constructor(
    private sessionLogRepo: SessionLogRepository,
    private bcryptService: BcryptService,
  ) {}

  async create(data) {
    const login_timestamp = new Date().toISOString();
    const encrypted_ip = await this.bcryptService.encrypt(data.ip_address);
    data.ip_address = encrypted_ip;
    data['login_timestamp'] = login_timestamp;
    return this.sessionLogRepo.create(data);
  }
  async findAll(page: number, limit: number, search?: string) {
    const data = await this.sessionLogRepo.findAll(page, limit, search);
    const formattedLogs = await Promise.all(
      data.logs.map(async (log) => ({
        ...log,
        user_id: log.user_id?.id ?? null,
        ip_address: await this.bcryptService.decrypt(log.ip_address),
      })),
    );

    return { logs: formattedLogs, total: data.total };
  }
}
