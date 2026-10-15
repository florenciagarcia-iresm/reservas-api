 import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Cliente } from './entities/Cliente';
import { Habitacion } from './entities/Habitacion';
import { Servicio } from './entities/Servicio';
import { Reserva } from './entities/Reserva';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'reservas',
  synchronize: true, // solo para desarrollo: crea/actualiza las tablas solo
  entities: [Cliente, Habitacion, Servicio, Reserva],
});