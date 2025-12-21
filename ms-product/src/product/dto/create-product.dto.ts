import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../enumeration/category.enum';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Laptop' })
  @IsNotEmpty({ message: 'name should not be empty' })
  name: string;

  @ApiProperty({ description: 'Price of the product', example: 1000 })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price must be a number with at most 2 decimals' },
  )
  @IsNotEmpty({ message: 'price should not be empty' })
  @Type(() => Number)
  @Min(0, { message: 'price must be greater than or equal to 0' })
  price: number;

  @ApiProperty({ description: 'Quantity available', example: 10 })
  @Type(() => Number)
  @IsInt({ message: 'quantity must be an integer' })
  @IsNotEmpty({ message: 'quantity should not be empty' })
  @Min(0, { message: 'quantity must be greater than or equal to 0' })
  quantity: number;

  @ApiProperty({ description: 'Category of the product', enum: Category })
  @IsEnum(Category, { message: 'category must be a valid category' })
  category: Category;

  @ApiProperty({ description: 'Discount percentage', example: 20, default: 0 })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'discount must be a number with at most 2 decimals' },
  )
  @IsOptional() // discount can be omitted
  @Min(0, { message: 'discount must be greater than or equal to 0' })
  discount: number;

  @ApiProperty({ description: 'ID of the seller', example: 1 })
  @Type(() => Number)
  @IsInt({ message: 'id_vendeur must be an integer' })
  @IsNotEmpty({ message: 'id_vendeur should not be empty' })
  @Min(1, { message: 'id_vendeur must be greater than or equal to 1' })
  id_vendeur: number;

  @ApiProperty({
    description: 'Discount start date',
    example: '2025-12-01',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber({}, { message: 'discount_start_at must be a number (timestamp)' })
  discount_start_at?: number | null;

  @ApiProperty({
    description: 'Discount end date',
    example: '2025-12-04',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber({}, { message: 'discount_end_at must be a number (timestamp)' })
  discount_end_at?: number | null;
}
