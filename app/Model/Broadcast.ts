import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum BroadcastStatus {
  SENT = "sent",
  SENDING = "sending",
  FAILED = "failed",
  CANCELED = "canceled",
}

export enum BroadCastType {
  BIRTHDAY = "birthday",
  ANIVERSARY = "aniversary",
}

@Entity("broadcast")
class Broadcast {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  user_id!: number;

  @Column("timestamptz")
  scheduled_at!: Date;

  @Column({
    type: "simple-enum",
    enum: BroadcastStatus,
    default: BroadcastStatus.SENDING,
  })
  status!: BroadcastStatus;

  @Column({
    type: "simple-enum",
    enum: BroadCastType,
  })
  type!: BroadCastType;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}
export default Broadcast;
