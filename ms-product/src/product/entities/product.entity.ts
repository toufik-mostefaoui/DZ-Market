import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../enumeration/category.enum";


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('json', { default: [] })
  images: { url: string; public_id: string }[];

  @Column({ type: 'double precision' })
  price: number;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Column({ type: 'double precision' })
  discount: number;

  @Column({ type: 'timestamp', nullable: true })
  discount_start_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  discount_end_at: Date | null;

  @Column({ type: 'double precision', default: 0 })
  rating: number;

  @Column({ type: 'double precision', default: 0 })
  viewes_number: number;

  @Column('json', { default: [] })
  feedBacks: { id_user: number; comment: string }[];

  @Column({ default: false })
  is_deleted: boolean;

  @Column()
  id_vendeur: number;


  @AfterLoad()
  setFinalPrice() {
    const now = new Date().getTime();
    

    const start = this.discount_start_at
      ? new Date(this.discount_start_at).getTime()
      : null;
    const end = this.discount_end_at
      ? new Date(this.discount_end_at).getTime()
      : null;

    const isDiscountValid =
      this.discount > 0 &&
      start !== null &&
      end !== null &&
      now >= start &&
      now <= end;

    if (isDiscountValid) {
      this.isValid = isDiscountValid;
      this.final_price = this.price - (this.price * this.discount) / 100;
    } else {
      this.isValid = isDiscountValid;
      this.final_price = this.price;
    }
  }
  isValid:boolean;
  final_price: number; // virtual field (not stored in DB)
}
