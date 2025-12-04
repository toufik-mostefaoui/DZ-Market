import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Category } from '../enumeration/category.enum';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  name: string;
  price: number;
  quantity: number;
  category: Category;
  discount: number;
  id_vendeur: number;
  discount_end_at: number;
  discount_start_at:number
}
