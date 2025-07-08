import { Router } from 'express';
import {
    getAllGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
} from '../controllers/group.controller';

const router = Router();

/**
 * @swagger
 * components:
 * schemas:
 * GrupoUsuario:
 * type: object
 * required:
 * - nome_grupo
 * properties:
 * grupo_id:
 * type: integer
 * description: Auto-generated ID of the group.
 * nome_grupo:
 * type: string
 * description: Name of the user group (e.g., 'GRUPO I', 'GRUPO II').
 * descricao:
 * type: string
 * description: Description of the group's pricing rules.
 * example:
 * grupo_id: 1
 * nome_grupo: "GRUPO II"
 * descricao: "Estudantes de graduação e pós-graduação stricto sensu com renda familiar per capita superior a 1,5 salário mínimo."
 */

/**
 * @swagger
 * tags:
 * - name: Grupos de Usuário
 * description: API for managing user groups and their pricing tiers
 */

router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

export default router;