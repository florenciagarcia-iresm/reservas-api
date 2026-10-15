import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Reserva } from './Reserva';

export const numerico = {
  to: (v: number) => v,
  from: (v: string | null) => (v === null ? null : parseFloat(v)),
};

@Entity()
export class Habitacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: numerico })
  precioPorNoche: number;

  @OneToMany(() => Reserva, (reserva) => reserva.habitacion)
  reservas: Relation<Reserva>[];
}