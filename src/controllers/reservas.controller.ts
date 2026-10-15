import { asyncHandler } from '../middlewares/asyncHandler';
import { parseId, validarReserva } from '../utils/validaciones';
import * as service from '../services/reservas.service';

export const listar = asyncHandler(async (_req, res) => {
  res.json(await service.listar());
});

export const obtener = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  res.json(await service.obtener(id));
});

export const crear = asyncHandler(async (req, res) => {
  const datos = validarReserva(req.body);
  const reserva = await service.crear(datos);
  res.status(201).json(reserva);
});

export const actualizar = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const datos = validarReserva(req.body);
  res.json(await service.actualizar(id, datos));
});

export const eliminar = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await service.eliminar(id);
  res.status(204).send();
});