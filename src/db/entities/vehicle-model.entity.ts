import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicle_models')
export class VehicleModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  fuel: string;

  @Column()
  transmition: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  power: number;

  @Column()
  seats: number;

  @Column()
  doors: number;

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
  searchVector: any;
}
