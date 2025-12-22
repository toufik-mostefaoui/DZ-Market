import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../enumeration/status.enum";

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

  @Column({ type: 'enum', enum: Status, default: Status.ENATTENTE })
  status: Status;
}
