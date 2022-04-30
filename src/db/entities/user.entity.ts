import dayjs from 'dayjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  lastName: string;

  @Column({ type: 'timestamp with time zone', name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({
    name: 'api_key',
    default: () => "encode(gen_random_bytes(32), 'hex')",
  })
  apiKey: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  getAge(atDate = new Date()) {
    return dayjs(atDate).diff(this.dateOfBirth, 'years');
  }
}
