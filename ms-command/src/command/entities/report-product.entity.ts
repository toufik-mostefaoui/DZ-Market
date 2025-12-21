import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_user: number;

  @Column()
  id_product: number;

  @Column()
  id_vendeur: number;

  @Column()
  id_command: number;

  @Column()
  description: string;
}
