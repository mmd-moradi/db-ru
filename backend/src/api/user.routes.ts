import { Router } from 'express';
import * as ctrl from '../controllers/user.controller';
const r = Router();

r.get('/', ctrl.getAll);        // GET /api/usuarios
r.post('/', ctrl.create);       // POST
r.get('/:id', ctrl.getOne);     // GET 1
r.put('/:id', ctrl.update);     // PUT
r.delete('/:id', ctrl.remove);  // DELETE

export default r;
