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
import { NumericTransformer } from '@transformers/numeric.transformer';
import { TVehicleJson, TVehiclePriceJson } from '../types/vehicle.type';
import DateUtils from '@src/common/utils/date.utils';

type TCalculatePriceParams = {
  fromDate: Date;
  toDate: Date;
  driverAge: number;
  returnDate?: Date;
  discountPercentage?: number;
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

  @Column({
    name: 'purchase_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
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

  calculatePrice({
    fromDate,
    toDate,
    driverAge,
    returnDate,
    discountPercentage,
  }: TCalculatePriceParams) {
    const bookingDays = DateUtils.getCeiledDifferenceInDays(fromDate, toDate);

    let total = this.purchasePrice * bookingDays * 0.001;
    const deposit = this.purchasePrice / this.mileage / 2 + 1.5 * driverAge;

    if (returnDate && returnDate > toDate) {
      const returnDelayDays = DateUtils.getCeiledDifferenceInDays(
        fromDate,
        toDate,
      );
      const delayFine = returnDelayDays * 100;

      total += delayFine;
    }

    if (discountPercentage) {
      total = total * ((100 - discountPercentage) / 100);
    }

    return {
      total: Number(total.toFixed(2)),
      deposit: Number(deposit.toFixed(2)),
    };
  }

  toJson({
    driverAge,
    fromDate,
    toDate,
  }: Partial<TCalculatePriceParams> = {}): TVehicleJson {
    let price: TVehiclePriceJson = null;

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
      bodyStyle: this.vehicleModel.bodyStyle,
      power: this.vehicleModel.power,
      seats: this.vehicleModel.seats,
      doors: this.vehicleModel.doors,
      imageUrl: this.vehicleModel.imageUrl,
      price,
    };
  }
}
