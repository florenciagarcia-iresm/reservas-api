import { Router } from 'express';
import { EntityTarget, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { HttpError } from '../errors/HttpError';
import { asyncHandler } from '../middlewares/asyncHandler';
import { parseId } from '../utils/validaciones';

export function crearCrudRouter(
  entidad: EntityTarget<any>,
  validar: (body: unknown) => Record<string, unknown>,
) {
  const router = Router();
  const repo = (): Repository<any> => AppDataSource.getRepository(entidad);

  const buscar = async (id: number) => {
    const encontrado = await repo().findOneBy({ id });
    if (!encontrado) throw new HttpError(404, `Recurso ${id} no encontrado`);
    return encontrado;
  };

  router.get('/', asyncHandler(async (_req, res) => {
    res.json(await repo().find({ order: { id: 'ASC' } }));
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    res.json(await buscar(parseId(req.params.id)));
  }));

  router.post('/', asyncHandler(async (req, res) => {
    const creado = await repo().save(repo().create(validar(req.body)));
    res.status(201).json(creado);
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const existente = await buscar(parseId(req.params.id));
    Object.assign(existente, validar(req.body));
    res.json(await repo().save(existente));
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    await repo().remove(await buscar(parseId(req.params.id)));
    res.status(204).send();
  }));

  return router;
}