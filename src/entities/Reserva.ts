import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Cliente } from './Cliente';
import { Habitacion, numerico } from './Habitacion';
import { Servicio } from './Servicio';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaEntrada: string;

  @Column({ type: 'date' })
  fechaSalida: string;

  @Column({ type: 'int' })
  huespedes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: numerico })
  total: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.reservas, { nullable: false })
  cliente: Relation<Cliente>;

  @ManyToOne(() => Habitacion, (habitacion) => habitacion.reservas, { nullable: false })
  habitacion: Relation<Habitacion>;

  @ManyToMany(() => Servicio, (servicio) => servicio.reservas)
  @JoinTable()
  servicios: Relation<Servicio>[];
}