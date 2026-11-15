import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class AddToCartDTO {
  @ApiProperty({
    description: 'The ID of the product to add to the cart',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  pid: number;
}

export class CartIdDTO {
  @ApiProperty({
    description: 'The ID of the cart item',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  id: number;
}

export class PaginationDTO {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 10;
}