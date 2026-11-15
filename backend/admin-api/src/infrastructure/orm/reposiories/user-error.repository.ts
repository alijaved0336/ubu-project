import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from './abstract.repository';
import { UserError } from '../entities/user-error.entity';

@Injectable()
export class UserErrorRepository extends AbstractRepository<UserError> {
  constructor(
    @InjectRepository(UserError)
    readonly userErrorRepository: Repository<UserError>,
  ) {
    super(userErrorRepository);
  }
}
