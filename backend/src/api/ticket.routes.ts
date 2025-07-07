import { Router } from 'express';
import * as ctrl from '../controllers/ticket.controller';
const r = Router();

r.get('/', ctrl.getAll);            // lista
r.get('/:id', ctrl.getOne);         // detalhe
r.post('/', ctrl.buy);              // compra ticket
r.put('/:id/cancelar', ctrl.cancel);// cancela

export default r;
