import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyKhaltiDto {
  @ApiProperty({ example: 'kPidx_...' })
  @IsString()
  @IsNotEmpty()
  pidx: string;

  @ApiProperty({ example: 'order-uuid' })
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
