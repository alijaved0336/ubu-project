import { IsNotEmpty, IsInt, IsOptional, Min } from "class-validator"
import { Double } from "typeorm"
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from "class-transformer";

class Color {
    @ApiPropertyOptional({ example: 'Red' })
    @IsOptional()
    color_name: string;

    @ApiPropertyOptional({ example: '#FF0000' })
    @IsOptional()
    color_code: string;
}
export class PaginationDTO {
    @ApiProperty({
        description: 'Page number for pagination',
        example: 1,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        description: 'Number of items per page',
        example: 10,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    limit?: number = 10;
}

export class MarkProductFavouriteDTO {
    @ApiProperty({
        description: 'The ID of the product',
        example: 1,
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    product_id: number;

    @ApiProperty({
        description: 'The ID of the post',
        example: 2,
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    post_id: number;

    @ApiProperty({
        description: 'The ID of the post product',
        example: 3,
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    post_product_id: number;
}

export class PostProductIdDTO {
    @ApiProperty({
        description: 'The ID of the post product',
        example: 1,
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    post_product_id: number;
}

export class ProductIdDTO {
    @ApiProperty({
        description: 'The ID of the product',
        example: 1,
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    id: number;
}

export class ReviewDTO {
    @IsNotEmpty()
    productId: number

    @IsOptional()
    rating: Double

    @IsOptional()
    comment: string

}