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

import { VehicleModel } from '@entities/vehicle-model.entity';
import { Booking } from '@entities/booking.entity';

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

  calculateRentalPrice(rentalDays: number) {
    const rentalPrice = Number(this.purchasePrice) * rentalDays * 0.001;
    return Number(rentalPrice.toFixed(2));
  }

  toJson({ rentalDays = 1 }: { rentalDays?: number } = {}) {
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
      price: this.calculateRentalPrice(rentalDays),
    };
  }
}
