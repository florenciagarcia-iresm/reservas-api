import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Reserva } from './Reserva';
import { numerico } from './Habitacion';

@Entity()
export class Servicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: numerico })
  precio: number;

  @ManyToMany(() => Reserva, (reserva) => reserva.servicios)
  reservas: Relation<Reserva>[];
}