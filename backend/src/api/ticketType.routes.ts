import { Router } from 'express';
import {
    getAllTicketTypes,
    getTicketTypeById,
    createTicketType,
    updateTicketType,
    deleteTicketType,
} from '../controllers/ticketType.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoTicket:
 *       type: object
 *       required:
 *         - nome_tipo
 *       properties:
 *         tipo_ticket_id:
 *           type: integer
 *           description: Auto-generated ID of the ticket type.
 *         nome_tipo:
 *           type: string
 *           description: The name of the ticket type (e.g., 'Cafe da Manha', 'Refeicao Principal').
 *       example:
 *         tipo_ticket_id: 1
 *         nome_tipo: "Refeicao Principal"
 */

/**
 * @swagger
 * tags:
 *   - name: Transações - Tipos de Ticket
 *     description: API for managing ticket types
 */

/**
 * @swagger
 * /api/ticket-types:
 *   get:
 *     summary: Retrieve a list of all ticket types
 *     tags: [Transações - Tipos de Ticket]
 *     responses:
 *       '200':
 *         description: A list of ticket types.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoTicket'
 *   post:
 *     summary: Create a new ticket type
 *     tags: [Transações - Tipos de Ticket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_tipo:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Ticket type created successfully.
 *       '409':
 *         description: Ticket type with this name already exists.
 */
router.route('/').get(getAllTicketTypes).post(createTicketType);

/**
 * @swagger
 * /api/ticket-types/{id}:
 *   get:
 *     summary: Get a ticket type by ID
 *     tags: [Transações - Tipos de Ticket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket type ID.
 *     responses:
 *       '200':
 *         description: Ticket type data.
 *       '404':
 *         description: Ticket type not found.
 *   put:
 *     summary: Update a ticket type
 *     tags: [Transações - Tipos de Ticket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket type ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_tipo:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Ticket type updated successfully.
 *       '404':
 *         description: Ticket type not found.
 *   delete:
 *     summary: Delete a ticket type
 *     tags: [Transações - Tipos de Ticket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket type ID.
 *     responses:
 *       '204':
 *         description: Ticket type deleted successfully.
 *       '400':
 *         description: Cannot delete, ticket type is in use.
 */
router.route('/:id').get(getTicketTypeById).put(updateTicketType).delete(deleteTicketType);

export default router;