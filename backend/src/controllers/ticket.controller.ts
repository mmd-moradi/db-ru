import { Request, Response } from 'express';
import * as svc from '../services/ticket.service';

export const getAll = async (_: Request, res: Response) =>
  res.json(await svc.findAll());

export const getOne = async (req: Request, res: Response) => {
  const t = await svc.findById(Number(req.params.id));
  return t
    ? res.json(t)
    : res.status(404).json({ msg: 'Ticket não encontrado' });
};

export const buy = async (req: Request, res: Response) => {
  // extrai parâmetros do corpo da requisição
  const { usuarioId, restauranteId, categoriaTicketId, preco } = req.body;

  try {
    const tk = await svc.create(
      Number(usuarioId),
      Number(restauranteId),
      Number(categoriaTicketId),
      Number(preco)
    );
    return res.status(201).json(tk);           // sucesso
  } catch (e: any) {
    if (e.code === 'SALDO')                    // saldo insuficiente
      return res.status(409).json({ msg: 'Saldo insuficiente' });

    console.error(e);
    return res.status(500).json({ msg: 'Erro ao comprar ticket' });
  }
};

export const cancel = async (req: Request, res: Response) => {
  await svc.cancel(Number(req.params.id));
  res.sendStatus(200);
};

