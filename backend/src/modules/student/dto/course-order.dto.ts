import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseOrderDto {
  @ApiProperty({ example: ['course-nec-civil'], description: 'Array of selected course identifiers' })
  @IsArray()
  @IsNotEmpty({ message: 'At least one course must be selected' })
  courseIds: string[];

  @ApiProperty({ description: 'Base64 data URI or image URL of the eSewa payment transfer screenshot' })
  @IsString()
  @IsNotEmpty({ message: 'Payment screenshot is required' })
  receiptImageUrl: string;

  @ApiProperty({ example: 'TXN-9824803556-101', required: false })
  @IsOptional()
  @IsString()
  transactionCode?: string;

  @ApiProperty({ example: 'Paid via eSewa to 9824803556 for NEC Civil preparation', required: false })
  @IsOptional()
  @IsString()
  paymentRemarks?: string;
}
