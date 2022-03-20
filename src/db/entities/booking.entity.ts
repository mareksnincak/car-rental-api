import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Vehicle } from '@entities/vehicle.entity';
import { TBookingJson, TJsonOptions } from '@db/types/booking.type';
import { NumericTransformer } from '@transformers/numeric.transformer';
import { User } from './user.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_date', type: 'timestamp with time zone' })
  fromDate: Date;

  @Column({ name: 'to_date', type: 'timestamp with time zone' })
  toDate: Date;

  @Column({ nullable: true, name: 'vehicle_id' })
  vehicleId: string;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ nullable: true, name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'price_total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  priceTotal: number;

  @Column({
    name: 'price_deposit',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  priceDeposit: number;

  @Column({ name: 'driver_name', type: 'varchar' })
  driverName: string;

  @Column({ name: 'driver_age', type: 'integer' })
  driverAge: number;

  @Column({ name: 'driver_email', type: 'varchar' })
  driverEmail: string;

  @Column({ name: 'driver_id_number', type: 'varchar' })
  driverIdNumber: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  toJson({ includePrivateData = false }: TJsonOptions = {}) {
    const { fromDate, toDate } = this;

    const jsonData: TBookingJson = {
      fromDate,
      toDate,
      vehicle: this.vehicle?.toJson(),
    };

    if (includePrivateData) {
      jsonData.id = this.id;
      jsonData.price = {
        total: this.priceTotal,
        deposit: this.priceDeposit,
      };
      jsonData.driver = {
        name: this.driverName,
        age: this.driverAge,
        email: this.driverEmail,
        idNumber: this.driverIdNumber,
      };
    }

    return jsonData;
  }
}
