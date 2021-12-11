import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { VehicleModel } from './vehicle-model.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryColumn()
  vin: string;

  @ManyToOne(() => VehicleModel)
  @JoinColumn({ name: 'vehicle_model_id' })
  vehicleModel: VehicleModel;

  @Column()
  color: string;

  @Column({ type: 'smallint' })
  year: number;

  @Column()
  mileage: number;

  toJson() {
    const { color, year, mileage, vehicleModel } = this;
    const { make, model, fuel, transmition, power, seats, doors } =
      vehicleModel;

    return {
      color,
      year,
      mileage,
      make,
      model,
      fuel,
      transmition,
      power,
      seats,
      doors,
    };
  }
}
