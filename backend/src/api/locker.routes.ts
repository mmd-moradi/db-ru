import { Router } from 'express';
import {
    getAllLockers,
    getLockerById,
    createLocker,
    updateLocker,
    deleteLocker,
} from '../controllers/locker.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Armario:
 *       type: object
 *       required:
 *         - restaurante_id
 *         - numero_armario
 *       properties:
 *         armario_id:
 *           type: integer
 *           description: Auto-generated ID of the locker.
 *         restaurante_id:
 *           type: integer
 *           description: ID of the restaurant where the locker is located.
 *         numero_armario:
 *           type: string
 *           description: The unique number or identifier of the locker.
 *         status:
 *           type: string
 *           enum: [Disponivel, Ocupado, Manutencao]
 *           description: The current status of the locker.
 *       example:
 *         armario_id: 1
 *         restaurante_id: 1
 *         numero_armario: "A01"
 *         status: "Disponivel"
 */

/**
 * @swagger
 * tags:
 *   - name: Armários - Gerenciamento
 *     description: API for managing physical lockers
 */

/**
 * @swagger
 * /api/lockers:
 *   get:
 *     summary: Retrieve a list of lockers
 *     tags: [Armários - Gerenciamento]
 *     parameters:
 *       - in: query
 *         name: restaurante_id
 *         schema:
 *           type: integer
 *         description: Optional ID to filter lockers by restaurant.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Disponivel, Ocupado, Manutencao]
 *         description: Optional status to filter lockers.
 *     responses:
 *       '200':
 *         description: A list of lockers matching the criteria.
 *   post:
 *     summary: Create a new locker
 *     tags: [Armários - Gerenciamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Armario'
 *     responses:
 *       '201':
 *         description: Locker created successfully.
 *       '409':
 *         description: A locker with this number already exists in this restaurant.
 */
router.route('/').get(getAllLockers).post(createLocker);

/**
 * @swagger
 * /api/lockers/{id}:
 *   get:
 *     summary: Get a locker by ID
 *     tags: [Armários - Gerenciamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The locker ID.
 *     responses:
 *       '200':
 *         description: Locker data.
 *       '404':
 *         description: Locker not found.
 *   put:
 *     summary: Update a locker's information
 *     tags: [Armários - Gerenciamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The locker ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Armario'
 *     responses:
 *       '200':
 *         description: Locker updated successfully.
 *       '404':
 *         description: Locker not found.
 *   delete:
 *     summary: Delete a locker
 *     tags: [Armários - Gerenciamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The locker ID.
 *     responses:
 *       '204':
 *         description: Locker deleted successfully.
 *       '400':
 *         description: Cannot delete locker as it has usage history.
 */
router.route('/:id').get(getLockerById).put(updateLocker).delete(deleteLocker);

export default router;