import { Category } from "../enumeration/category.enum";

export class CreateProductDto {
  name: string;
  price: number;
  quantity: number;
  category: Category;
  discount: number;
  id_vendeur: number;
  discount_end_at: number | null;
  discount_start_at:number | null
}
