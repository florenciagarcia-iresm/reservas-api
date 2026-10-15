import cors from 'cors';
import express from 'express';
import { errorHandler, notFound } from './middlewares/errorHandler';
import { logger } from './middlewares/logger';
import { clientesRouter, habitacionesRouter, serviciosRouter } from './routes/catalogos';
import reservasRouter from './routes/reservas';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/clientes', clientesRouter);
app.use('/habitaciones', habitacionesRouter);
app.use('/servicios', serviciosRouter);
app.use('/reservas', reservasRouter);

app.use(notFound);
app.use(errorHandler);