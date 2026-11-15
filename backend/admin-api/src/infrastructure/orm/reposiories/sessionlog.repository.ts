import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SessionLog } from '../entities/sessionlog.entity';

export class SessionLogRepository {
  constructor(
    @InjectRepository(SessionLog)
    private readonly sessionLogRepository: Repository<SessionLog>,
  ) {}

  async create(data) {
    const sessionLog = {
      login_timestamp: data.login_timestamp,
      ip_address: data.ip_address,
      operation_system: data.operating_system,
      browsing_info: data.browsing_info,
      device_type: data.device_type,
      user_id: data.user_id,
    };
    return await this.sessionLogRepository.save(sessionLog);
  }

  async findAll(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    let whereCondition: any = [];

    if (!isNaN(Number(search))) {
      whereCondition.push({ user_id: { id: Number(search) } });
    } else if (search) {
      whereCondition.push(
        { ip_address: Like(`%${search}%`) },
        { operation_system: Like(`%${search}%`) },
        { browsing_info: Like(`%${search}%`) },
        { device_type: Like(`%${search}%`) },
      );
    }

    const [logs, total] = await this.sessionLogRepository.findAndCount({
      where: search ? whereCondition : {},
      skip: skip,
      take: limit,
      order: {
        id: 'DESC',
      },
      relations: ['user_id'],
    });

    return { logs, total };
  }
}
