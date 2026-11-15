import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductRequestDto {
  @ApiProperty({ example: 4, description: 'The unique ID of the product' })
  @IsInt()
  @IsNotEmpty()
  readonly product_id: number;

  @ApiProperty({ example: 2, description: 'The quantity requested' })
  @IsInt()
  @IsNotEmpty()
  readonly quantity: number;

  @ApiProperty({ example: "I want to buy this for my function next week", description: 'Any message to tell the parent user why you want it' })
  @IsOptional()
  @IsString()
  readonly message: string;

}


export class UpdateProductRequestStatusDto {
  @ApiProperty({ example: 1, description: 'The ID of the product request to update' })
  @IsInt()
  @IsNotEmpty()
  readonly requestId: number;

  @ApiProperty({ example: 'bought', description: 'The new status of the product request', enum: ['pending', 'bought', 'cancelled', 'approved'] })
  @IsEnum(['pending', 'bought', 'cancelled', 'approved'])
  @IsNotEmpty()
  readonly status: 'pending' | 'bought' | 'cancelled' | 'approved';
}

export class BulkUpdateProductRequestStatusDto {
  @ApiProperty({ 
    example: ['1', '2', '3'], 
    description: 'An array of product request IDs to update' 
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly requestIds: string[];

  @ApiProperty({ example: 'cancelled', description: 'The new status for all selected product requests', enum: ['pending', 'bought', 'cancelled', 'approved'] })
  @IsEnum(['pending', 'bought', 'cancelled', 'approved'])
  @IsNotEmpty()
  readonly status: 'pending' | 'bought' | 'cancelled' | 'approved';
}