import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommandItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_command: number;

  @Column()
  id_vendeur: number;

  @Column()
  id_product: number;

  @Column()
  quantity: number;

  @Column({ type: 'double precision' })
  price; // snapshot
}
