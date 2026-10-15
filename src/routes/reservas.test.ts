import request from 'supertest';
import { app } from '../app';
import * as service from '../services/reservas.service';
import { HttpError } from '../errors/HttpError';
import { Reserva } from '../entities/Reserva';

jest.mock('../services/reservas.service');
const mockService = jest.mocked(service);

const bodyValido = {
  clienteId: 1,
  habitacionId: 1,
  fechaEntrada: '2026-11-01',
  fechaSalida: '2026-11-03',
  huespedes: 2,
};

const reservaFalsa = { id: 1, ...bodyValido, total: 160 } as unknown as Reserva;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('GET /reservas', () => {
  it('responde 200 y una lista', async () => {
    mockService.listar.mockResolvedValue([reservaFalsa]);
    const res = await request(app).get('/reservas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });
});

describe('GET /reservas/:id', () => {
  it('responde 200 con la reserva', async () => {
    mockService.obtener.mockResolvedValue(reservaFalsa);
    const res = await request(app).get('/reservas/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('responde 404 si la reserva no existe', async () => {
    mockService.obtener.mockRejectedValue(new HttpError(404, 'Reserva 99999 no encontrada'));
    const res = await request(app).get('/reservas/99999');
    expect(res.status).toBe(404);
  });

  it('responde 400 si el id no es numérico', async () => {
    const res = await request(app).get('/reservas/abc');
    expect(res.status).toBe(400);
  });
});

describe('POST /reservas', () => {
  it('crea una reserva válida y responde 201', async () => {
    mockService.crear.mockResolvedValue(reservaFalsa);
    const res = await request(app).post('/reservas').send(bodyValido);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('responde 400 si faltan datos', async () => {
    const res = await request(app).post('/reservas').send({});
    expect(res.status).toBe(400);
    expect(mockService.crear).not.toHaveBeenCalled();
  });

  it('responde 400 si la salida es anterior a la entrada', async () => {
    const res = await request(app)
      .post('/reservas')
      .send({ ...bodyValido, fechaEntrada: '2026-11-05', fechaSalida: '2026-11-01' });
    expect(res.status).toBe(400);
  });

  it('responde 409 si la habitación ya está ocupada', async () => {
    mockService.crear.mockRejectedValue(new HttpError(409, 'La habitación ya está reservada'));
    const res = await request(app).post('/reservas').send(bodyValido);
    expect(res.status).toBe(409);
  });
});

describe('PUT /reservas/:id', () => {
  it('actualiza y responde 200', async () => {
    mockService.actualizar.mockResolvedValue(reservaFalsa);
    const res = await request(app).put('/reservas/1').send(bodyValido);
    expect(res.status).toBe(200);
  });

  it('responde 400 con body inválido', async () => {
    const res = await request(app).put('/reservas/1').send({ huespedes: 0 });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /reservas/:id', () => {
  it('elimina y responde 204', async () => {
    mockService.eliminar.mockResolvedValue(undefined);
    const res = await request(app).delete('/reservas/1');
    expect(res.status).toBe(204);
  });

  it('responde 404 si no existe', async () => {
    mockService.eliminar.mockRejectedValue(new HttpError(404, 'No encontrada'));
    const res = await request(app).delete('/reservas/99999');
    expect(res.status).toBe(404);
  });
});

describe('rutas inexistentes', () => {
  it('responde 404', async () => {
    const res = await request(app).get('/nada');
    expect(res.status).toBe(404);
  });
});