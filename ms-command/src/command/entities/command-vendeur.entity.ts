import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../enumeration/status.enum";

@Entity()
export class CommandVendeur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_command: number;

  @Column()
  id_vendeur: number;

  @Column({ type: 'double precision' })
  sub_total: number;

  @Column({ type: 'enum', enum: Status, default: Status.ENATTENTE })
  status: Status;
}
