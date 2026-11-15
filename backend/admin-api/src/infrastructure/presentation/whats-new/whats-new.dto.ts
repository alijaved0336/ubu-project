import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWhatsNewDto {
  @ApiProperty({
    description: 'Title of the whats-new post',
    example: 'New Feature Released',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the whats-new post',
    example: 'We have released a new feature to improve your experience.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the whats-new post',
    example: [{ tagName: 'update', tagColor: 'blue' }],
  })
  @IsOptional()
  tags?: { tagName: string; tagColor: string }[];
}

export class UpdateWhatsNewDto {
  @ApiPropertyOptional({
    description: 'Title of the whats-new post',
    example: 'Updated Feature Release',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the whats-new post',
    example: 'We have improved the new feature for better performance.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the whats-new post',
    example: [{ tagName: 'update', tagColor: 'green' }],
  })
  @IsOptional()
  tags?: { tagName: string; tagColor: string }[];
}
