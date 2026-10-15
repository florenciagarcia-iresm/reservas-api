import { AppDataSource } from './data-source';
import { Cliente } from './entities/Cliente';
import { Habitacion } from './entities/Habitacion';
import { Servicio } from './entities/Servicio';

async function seed() {
  await AppDataSource.initialize();

  if ((await AppDataSource.getRepository(Cliente).count()) === 0) {
    await AppDataSource.getRepository(Cliente).save([
      { nombre: 'Ana Pérez', email: 'ana@example.com' },
      { nombre: 'Luis Gómez', email: 'luis@example.com' },
    ]);
  }

  if ((await AppDataSource.getRepository(Habitacion).count()) === 0) {
    await AppDataSource.getRepository(Habitacion).save([
      { numero: '101', capacidad: 2, precioPorNoche: 80 },
      { numero: '102', capacidad: 3, precioPorNoche: 110 },
      { numero: '201', capacidad: 4, precioPorNoche: 150 },
    ]);
  }

  if ((await AppDataSource.getRepository(Servicio).count()) === 0) {
    await AppDataSource.getRepository(Servicio).save([
      { nombre: 'Desayuno', precio: 15 },
      { nombre: 'Spa', precio: 40 },
    ]);
  }

  console.log('Seed completado');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});