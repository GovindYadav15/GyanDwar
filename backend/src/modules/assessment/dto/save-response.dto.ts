import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveResponseDto {
  @ApiProperty({ example: 'b39d1...' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: 'opt2', nullable: true })
  @IsOptional()
  @IsString()
  selectedOptionId?: string | null;

  @ApiProperty({ example: 45, default: 0 })
  @IsOptional()
  @IsInt()
  timeSpentSeconds?: number;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isMarkedForReview?: boolean;
}
