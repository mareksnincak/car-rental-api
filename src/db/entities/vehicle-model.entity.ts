import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TBodyStyle, TFuel, TTransmission } from '@vehicles/vehicle.type';

@Entity('vehicle_models')
export class VehicleModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  fuel: TFuel;

  @Column()
  transmission: TTransmission;

  @Column({ name: 'body_style' })
  bodyStyle: TBodyStyle;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  power: number;

  @Column()
  seats: number;

  @Column()
  doors: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  /**
   *  This column is set automatically by "vehicle_model_search_vector_trigger"
   */
  @Column({
    type: 'tsvector',
    name: 'search_vector',
    insert: false,
    update: false,
    select: false,
    nullable: true,
  })
  searchVector: unknown;
}
