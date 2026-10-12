import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEsewaDto {
  @ApiProperty({ description: 'Base64 encoded data string returned by eSewa redirect' })
  @IsString()
  @IsNotEmpty()
  data: string;
}
