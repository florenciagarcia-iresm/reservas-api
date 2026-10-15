import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Reserva } from './Reserva';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Reserva, (reserva) => reserva.cliente)
  reservas: Relation<Reserva>[];
}