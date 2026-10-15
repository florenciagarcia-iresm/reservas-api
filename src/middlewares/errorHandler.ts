import { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../errors/HttpError';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }
  const code = err?.code ?? err?.driverError?.code;
  if (code === '23505') {
    res.status(409).json({ error: 'Ya existe un registro con ese valor único' });
    return;
  }
  if (code === '23503') {
    res.status(409).json({ error: 'La operación afecta a registros relacionados' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};