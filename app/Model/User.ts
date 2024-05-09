import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { unique: true })
  email!: string;

  @Column("varchar")
  first_name!: string;

  @Column("varchar")
  last_name!: string;

  @Column("varchar")
  location!: string;

  @Column("smallint")
  utcOffset!: number; // different from utc in minutes

  @Column("date")
  birthday!: Date;

  @Column("boolean", { default: true })
  active!: boolean;

  @Column("varchar", { select: false, nullable: true })
  password?: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;

  public get full_name() {
    return `${this.first_name} ${this.last_name}`;
  }
}
export default User;
