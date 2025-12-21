import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CommandProductDto {
  @ApiProperty({ description: 'ID of the product', example: 1 })
  @IsNotEmpty({ message: 'id_product should not be empty' })
  id_product: number;

  @ApiProperty({ description: 'Quantity of the product', example: 2 })
  @IsNotEmpty({ message: 'quantity should not be empty' })
  quantity: number;
}