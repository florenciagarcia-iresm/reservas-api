import { DeepPartial, In, LessThan, MoreThan, Not } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Cliente } from '../entities/Cliente';
import { Habitacion } from '../entities/Habitacion';
import { Servicio } from '../entities/Servicio';
import { Reserva } from '../entities/Reserva';
import { HttpError } from '../errors/HttpError';
import { calcularNoches, calcularTotal, hayCapacidad } from '../utils/reservas';
import { DatosReserva } from '../utils/validaciones';

const RELACIONES = ['cliente', 'habitacion', 'servicios'];
const repo = () => AppDataSource.getRepository(Reserva);

export async function listar() {
  return repo().find({ relations: RELACIONES, order: { id: 'ASC' } });
}

export async function obtener(id: number) {
  const reserva = await repo().findOne({ where: { id }, relations: RELACIONES });
  if (!reserva) throw new HttpError(404, `Reserva ${id} no encontrada`);
  return reserva;
}

async function construir(data: DatosReserva, excluirId?: number): Promise<DeepPartial<Reserva>> {
  const cliente = await AppDataSource.getRepository(Cliente).findOneBy({ id: data.clienteId });
  if (!cliente) throw new HttpError(404, `Cliente ${data.clienteId} no encontrado`);

  const habitacion = await AppDataSource.getRepository(Habitacion).findOneBy({
    id: data.habitacionId,
  });
  if (!habitacion) throw new HttpError(404, `Habitación ${data.habitacionId} no encontrada`);

  if (!hayCapacidad(data.huespedes, habitacion.capacidad)) {
    throw new HttpError(400, `La habitación admite hasta ${habitacion.capacidad} huéspedes`);
  }

  const ocupada = await repo().exists({
    where: {
      habitacion: { id: habitacion.id },
      fechaEntrada: LessThan(data.fechaSalida),
      fechaSalida: MoreThan(data.fechaEntrada),
      ...(excluirId ? { id: Not(excluirId) } : {}),
    },
  });
  if (ocupada) {
    throw new HttpError(409, 'La habitación ya está reservada en esas fechas');
  }

  let servicios: Servicio[] = [];
  if (data.servicioIds.length > 0) {
    servicios = await AppDataSource.getRepository(Servicio).findBy({ id: In(data.servicioIds) });
    if (servicios.length !== data.servicioIds.length) {
      throw new HttpError(404, 'Alguno de los servicios indicados no existe');
    }
  }

  const noches = calcularNoches(new Date(data.fechaEntrada), new Date(data.fechaSalida));
  const total = calcularTotal(
    noches,
    habitacion.precioPorNoche,
    servicios.map((s) => s.precio),
  );

  return {
    fechaEntrada: data.fechaEntrada,
    fechaSalida: data.fechaSalida,
    huespedes: data.huespedes,
    total,
    cliente,
    habitacion,
    servicios,
  };
}

export async function crear(data: DatosReserva) {
  const datos = await construir(data);
  const guardada = await repo().save(repo().create(datos));
  return obtener(guardada.id);
}

export async function actualizar(id: number, data: DatosReserva) {
  await obtener(id);
  const datos = await construir(data, id);
  await repo().save({ ...datos, id });
  return obtener(id);
}

export async function eliminar(id: number) {
  const reserva = await obtener(id);
  await repo().remove(reserva);
}