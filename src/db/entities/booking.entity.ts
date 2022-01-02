import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Type } from 'class-transformer';

import { Vehicle } from '@entities/vehicle.entity';
import { TJsonData, TJsonOptions } from '@db/types/booking.type';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_date', type: 'timestamp with time zone' })
  fromDate: Date;

  @Column({ name: 'to_date', type: 'timestamp with time zone' })
  toDate: Date;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ nullable: true, name: 'vehicle_id' })
  vehicleId: string;

  @Column({ name: 'price_total', type: 'decimal', precision: 10, scale: 2 })
  @Type(() => Number)
  priceTotal: number;

  @Column({ name: 'price_deposit', type: 'decimal', precision: 10, scale: 2 })
  @Type(() => Number)
  priceDeposit: number;

  @Column({ name: 'driver_name', type: 'varchar' })
  driverName: string;

  @Column({ name: 'driver_age', type: 'integer' })
  driverAge: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  toJson({ includePrivateData = false }: TJsonOptions = {}) {
    const jsonData: TJsonData = {
      fromDate: this.fromDate,
      toDate: this.toDate,
    };

    if (includePrivateData) {
      jsonData.id = this.id;
      jsonData.price = {
        total: this.priceTotal,
        deposit: this.priceDeposit,
      };
      jsonData.vehicleId = this.vehicleId;
      jsonData.driver = {
        name: this.driverName,
        age: this.driverAge,
      };
    }

    return jsonData;
  }
}
