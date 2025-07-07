import { Request, Response } from 'express';
import * as userSvc from '../services/user.service';

export const getAll = async (_: Request, res: Response) =>
  res.json(await userSvc.findAll());

export const getOne = async (req: Request, res: Response) => {
  const u = await userSvc.findById(Number(req.params.id));
  u ? res.json(u) : res.status(404).json({ msg: 'Usuário não encontrado' });
};

export const create = async (req: Request, res: Response) =>
  res.status(201).json(await userSvc.create(req.body));

export const update = async (req: Request, res: Response) => {
  const u = await userSvc.update(Number(req.params.id), req.body);
  u ? res.json(u) : res.status(404).json({ msg: 'Usuário não encontrado' });
};

export const remove = async (req: Request, res: Response) => {
  await userSvc.remove(Number(req.params.id));
  res.sendStatus(204);
};
