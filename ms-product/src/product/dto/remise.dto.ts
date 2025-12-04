import { ApiProperty } from '@nestjs/swagger';

export class RemiseDto {
  @ApiProperty({ description: 'Discount percentage', example: 20 })
  discount: number;

  @ApiProperty({ description: 'Discount start date', example: '2025-12-12T00:00:00.000Z' })
  start_date: Date;

  @ApiProperty({ description: 'Discount end date', example: '2025-12-14T23:59:59.000Z' })
  end_date: Date;
}
