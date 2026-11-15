import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IGenderRepository } from '@domain/repository/gender.repository.interface';
import { Gender } from '../entities/gender.entity';

@Injectable()
export class GenderRepository implements IGenderRepository {
  constructor(
    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
  ) {}

  async findAll(): Promise<Gender[]> {
    return this.genderRepository.find();
  }

  async findById(id: number): Promise<Gender | null> {
    return this.genderRepository.findOne({ where: { id } });
  }
}
