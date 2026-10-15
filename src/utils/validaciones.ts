import { HttpError } from '../errors/HttpError';

type Body = Record<string, unknown>;

const bad = (msg: string) => new HttpError(400, msg);
const comoObjeto = (body: unknown): Body =>
  body && typeof body === 'object' ? (body as Body) : {};

const esTexto = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;
const esEnteroPositivo = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v > 0;
const esNumero = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

export function parseId(valor: string): number {
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) {
    throw bad('El id debe ser un entero positivo');
  }
  return n;
}

function validarFecha(valor: unknown, campo: string): string {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    throw bad(`${campo} es obligatoria y debe tener formato YYYY-MM-DD`);
  }
  const d = new Date(`${valor}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== valor) {
    throw bad(`${campo} no es una fecha válida`);
  }
  return valor;
}

export function validarCliente(body: unknown) {
  const b = comoObjeto(body);
  if (!esTexto(b.nombre)) throw bad('nombre es obligatorio');
  if (!esTexto(b.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
    throw bad('email es obligatorio y debe ser válido');
  }
  return { nombre: b.nombre.trim(), email: b.email.trim().toLowerCase() };
}

export function validarHabitacion(body: unknown) {
  const b = comoObjeto(body);
  if (!esTexto(b.numero)) throw bad('numero es obligatorio (texto)');
  if (!esEnteroPositivo(b.capacidad)) throw bad('capacidad debe ser un entero positivo');
  if (!esNumero(b.precioPorNoche) || b.precioPorNoche <= 0) {
    throw bad('precioPorNoche debe ser un número mayor a 0');
  }
  return {
    numero: b.numero.trim(),
    capacidad: b.capacidad,
    precioPorNoche: b.precioPorNoche,
  };
}

export function validarServicio(body: unknown) {
  const b = comoObjeto(body);
  if (!esTexto(b.nombre)) throw bad('nombre es obligatorio');
  if (!esNumero(b.precio) || b.precio < 0) {
    throw bad('precio debe ser un número mayor o igual a 0');
  }
  return { nombre: b.nombre.trim(), precio: b.precio };
}

export interface DatosReserva {
  clienteId: number;
  habitacionId: number;
  fechaEntrada: string;
  fechaSalida: string;
  huespedes: number;
  servicioIds: number[];
}

export function validarReserva(body: unknown): DatosReserva {
  const b = comoObjeto(body);
  if (!esEnteroPositivo(b.clienteId)) throw bad('clienteId es obligatorio (entero positivo)');
  if (!esEnteroPositivo(b.habitacionId)) throw bad('habitacionId es obligatorio (entero positivo)');
  const fechaEntrada = validarFecha(b.fechaEntrada, 'fechaEntrada');
  const fechaSalida = validarFecha(b.fechaSalida, 'fechaSalida');
  if (fechaSalida <= fechaEntrada) {
    throw bad('La fecha de salida debe ser posterior a la de entrada');
  }
  if (!esEnteroPositivo(b.huespedes)) throw bad('huespedes debe ser un entero positivo');

  let servicioIds: number[] = [];
  if (b.servicioIds !== undefined) {
    if (!Array.isArray(b.servicioIds) || !b.servicioIds.every(esEnteroPositivo)) {
      throw bad('servicioIds debe ser un arreglo de enteros positivos');
    }
    servicioIds = [...new Set(b.servicioIds as number[])];
  }

  return {
    clienteId: b.clienteId,
    habitacionId: b.habitacionId,
    fechaEntrada,
    fechaSalida,
    huespedes: b.huespedes,
    servicioIds,
  };
}