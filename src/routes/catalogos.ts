import { Cliente } from '../entities/Cliente';
import { Habitacion } from '../entities/Habitacion';
import { Servicio } from '../entities/Servicio';
import { validarCliente, validarHabitacion, validarServicio } from '../utils/validaciones';
import { crearCrudRouter } from './crud';

export const clientesRouter = crearCrudRouter(Cliente, validarCliente);
export const habitacionesRouter = crearCrudRouter(Habitacion, validarHabitacion);
export const serviciosRouter = crearCrudRouter(Servicio, validarServicio);