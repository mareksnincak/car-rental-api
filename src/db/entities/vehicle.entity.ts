import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import dayjs from 'dayjs';

import { VehicleModel } from '@entities/vehicle-model.entity';
import { Booking } from '@entities/booking.entity';
import { Type } from 'class-transformer';

type TCalculatePriceParams = {
  fromDate: Date;
  toDate: Date;
  driverAge: number;
};

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vin: string;

  @Column()
  color: string;

  @Column({ type: 'smallint' })
  year: number;

  @Column()
  mileage: number;

  @Column({ name: 'purchase_price', type: 'decimal', precision: 10, scale: 2 })
  @Type(() => Number)
  purchasePrice: number;

  @ManyToOne(() => VehicleModel)
  @JoinColumn({ name: 'vehicle_model_id' })
  vehicleModel: VehicleModel;

  @Column({ nullable: true, name: 'vehicle_model_id' })
  vehicleModelId: string;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  calculatePrice({ fromDate, toDate, driverAge }: TCalculatePriceParams) {
    const bookingDays = Math.ceil(dayjs(toDate).diff(fromDate, 'days', true));

    const total = this.purchasePrice * bookingDays * 0.001;
    const deposit = this.purchasePrice / this.mileage / 2 + 1.5 * driverAge;

    return {
      total: Number(total.toFixed(2)),
      deposit: Number(deposit.toFixed(2)),
    };
  }

  toJson({ driverAge, fromDate, toDate }: Partial<TCalculatePriceParams> = {}) {
    let price: { total: number; deposit: number } | null = null;

    if (driverAge && fromDate && toDate) {
      price = this.calculatePrice({ driverAge, fromDate, toDate });
    }

    return {
      id: this.id,
      color: this.color,
      year: this.year,
      mileage: this.mileage,
      make: this.vehicleModel.make,
      model: this.vehicleModel.model,
      fuel: this.vehicleModel.fuel,
      transmission: this.vehicleModel.transmission,
      power: this.vehicleModel.power,
      seats: this.vehicleModel.seats,
      doors: this.vehicleModel.doors,
      price,
    };
  }
}
