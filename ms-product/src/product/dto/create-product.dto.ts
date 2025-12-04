import { ApiProperty } from '@nestjs/swagger';
import { Category } from "../enumeration/category.enum";

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Laptop' })
  name: string;

  @ApiProperty({ description: 'Price of the product', example: 1000 })
  price: number;

  @ApiProperty({ description: 'Quantity available', example: 10 })
  quantity: number;

  @ApiProperty({ description: 'Category of the product', enum: Category })
  category: Category;

  @ApiProperty({ description: 'Discount percentage', example: 20, default: 0 })
  discount: number;

  @ApiProperty({ description: 'ID of the seller', example: 1 })
  id_vendeur: number;

  @ApiProperty({ description: 'Discount start date', example: '2025-12-12T00:00:00.000Z', required: false, nullable: true })
  discount_start_at: number | null;

  @ApiProperty({ description: 'Discount end date', example: '2025-12-14T23:59:59.000Z', required: false, nullable: true })
  discount_end_at: number | null;
}
