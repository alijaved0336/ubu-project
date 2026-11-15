import { IStyleRepository } from '@domain/repository/style.repository.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Style } from '../entities/style.entity';

@Injectable()
export class StyleRepository implements IStyleRepository {
  constructor(
    @InjectRepository(Style)
    private readonly styleRepository: Repository<Style>,
  ) {}

  async findAll(): Promise<Style[]> {
    return this.styleRepository.find();
  }

  async findById(id: number): Promise<Style | null> {
    return this.styleRepository.findOne({ where: { id } });
  }
}
