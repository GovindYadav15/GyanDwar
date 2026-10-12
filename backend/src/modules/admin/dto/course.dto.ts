import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCoursePayloadDto {
  @ApiProperty({ example: 'Nepal Engineering Council (NEC) - Civil License Complete Track' })
  @IsString()
  @IsNotEmpty({ message: 'Course title is required' })
  title: string;

  @ApiProperty({ example: 'Comprehensive syllabus coverage, 100-mark mock models with negative marking...' })
  @IsString()
  @IsNotEmpty({ message: 'Course description is required' })
  description: string;

  @ApiProperty({ example: 1999 })
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Price must be positive or zero' })
  priceNpr: number;

  @ApiPropertyOptional({ example: 2999 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  originalPriceNpr?: number;

  @ApiPropertyOptional({ example: 'NEC' })
  @IsOptional()
  @IsString()
  categoryCode?: string;

  @ApiPropertyOptional({ example: 'Civil Engineering' })
  @IsOptional()
  @IsString()
  faculty?: string;

  @ApiPropertyOptional({ example: '120+ Study Hours' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ example: 'Best Seller' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({ example: ['Full Syllabus Coverage', 'Chapter Formulas & PDFs', 'Unlimited Model Tests'] })
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateCoursePayloadDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceNpr?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  originalPriceNpr?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  faculty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateCourseChapterPayloadDto {
  @ApiProperty({ example: 'Fluid Mechanics & Hydraulics' })
  @IsString()
  @IsNotEmpty({ message: 'Chapter title is required' })
  title: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  chapterNumber: number;

  @ApiPropertyOptional({ example: 'Covers fluid pressure, hydrostatics, laminar and turbulent flow...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFreePreview?: boolean;
}

export class UpdateChapterPayloadDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  chapterNumber?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFreePreview?: boolean;
}
