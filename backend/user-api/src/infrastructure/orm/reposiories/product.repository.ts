import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Products } from "../entities/product.entity";

@Injectable()
export class ProductRepository{

  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) { }

  async findAllProducts( page: number, limit: number): Promise<Products[]> {
    const skip = (page - 1) * limit;
    return this.productRepository.find({
      skip: skip,
      take: limit,
    });
  }

  async findById(id: number): Promise<Products | null>{
    return this.productRepository.findOne({where:{id}})
  }


}