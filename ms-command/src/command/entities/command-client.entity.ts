import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../enumeration/status.enum";

@Entity()
export class CommandClient {
  @PrimaryGeneratedColumn()
  id_command: number;

  @Column()
  id_client: number; // client

  @Column({ type: 'double precision' })
  total_price: number;

  @Column({ type: 'enum', enum: Status, default: Status.ENATTENTE })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
