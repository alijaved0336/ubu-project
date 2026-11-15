import { User } from '@infrastructure/orm/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ConsumerDto {
  @ApiProperty({ description: 'The ID of the consumer' })
  id: number;

  @ApiProperty({ description: 'The name of the consumer' })
  name: string;

  @ApiProperty({ description: 'The email of the consumer' })
  email: string;

  @ApiProperty({ description: 'The creation date of the consumer account' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the consumer account' })
  updatedAt: Date;
}

export class UpdateConsumerDto {
  @ApiProperty({
    description: 'The gender of the consumer.',
    example: 'male',
  })
  @IsNotEmpty()
  @IsString()
  gender: string;
}


export class CreateScanDto {
  @ApiProperty({ example: 'male' })
  @IsString()
  gender: string;

  @ApiProperty({ example: 1702, description: 'Height in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  height: number;

  @ApiProperty({ example: 77111, description: 'Weight in grams' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  weight: number;

  @ApiProperty({ example: 988, description: 'Outseam (right) in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  outseamR: number;

  @ApiProperty({ example: 592, description: 'Thigh girth (right) in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  thighGirthR: number;

  @ApiProperty({ example: 919, description: 'Belly waist girth in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bellyWaistGirth: number;

  @ApiProperty({ example: 1006, description: 'Bust girth in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bustGirth: number;

  @ApiProperty({ example: 988, description: 'Hip girth in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  hipGirth: number;

  @ApiProperty({ example: 584, description: 'Outer arm length (right) in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  outerArmLengthR: number;

  @ApiProperty({ example: 480, description: 'Across back shoulder width in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  acrossBackShoulderWidth: number;

  @ApiProperty({ example: 905, description: 'Waist girth in millimeters' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  waistGirth: number;
}
