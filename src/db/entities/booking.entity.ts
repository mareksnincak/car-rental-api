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
import { TJsonData, TJsonOptions } from '@db/types/booking.type';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp with time zone' })
  from: Date;

  @Column({ type: 'timestamp with time zone' })
  to: Date;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  toJson({ includePrivateData = false }: TJsonOptions = {}) {
    const jsonData: TJsonData = {
      from: this.from,
      to: this.to,
    };

    if (includePrivateData) {
      jsonData.id = this.id;
      jsonData.price = this.price;
    }

    return {
      from: this.from,
      to: this.to,
    };
  }
}
