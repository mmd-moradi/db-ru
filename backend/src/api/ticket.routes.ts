import { Router } from 'express';
import {
    getAllTickets,
    getUserTickets,
} from '../controllers/ticket.controller';

const router = Router();

/**
 * @swagger
 * components:
 * schemas:
 * Ticket:
 * type: object
 * properties:
 * ticket_id:
 * type: integer
 * description: Auto-generated ID of the ticket.
 * usuario_id:
 * type: integer
 * description: ID of the user who owns the ticket.
 * nome_usuario:
 * type: string
 * description: Name of the user.
 * transacao_id:
 * type: integer
 * description: ID of the purchase transaction.
 * tipo_ticket_id:
 * type: integer
 * description: ID of the ticket type.
 * nome_tipo:
 * type: string
 * description: Name of the ticket type (e.g., 'Refeicao Principal').
 * data_compra:
 * type: string
 * format: date-time
 * description: The timestamp of the purchase.
 * example:
 * ticket_id: 501
 * usuario_id: 1
 * nome_usuario: "João da Silva"
 * transacao_id: 1001
 * tipo_ticket_id: 2
 * nome_tipo: "Refeicao Principal"
 * data_compra: "2025-07-08T12:30:00.000Z"
 */

/**
 * @swagger
 * tags:
 * - name: Tickets
 * description: API for viewing purchased tickets
 */

/**
 * @swagger
 * /api/tickets:
 * get:
 * summary: Retrieve a list of all purchased tickets (Admin)
 * tags: [Tickets]
 * responses:
 * '200':
 * description: A list of all tickets.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Ticket'
 */
router.get('/', getAllTickets);

/**
 * @swagger
 * /api/tickets/user/{userId}:
 * get:
 * summary: Get all tickets for a specific user
 * tags: [Tickets]
 * parameters:
 * - in: path
 * name: userId
 * schema:
 * type: integer
 * required: true
 * description: The user's ID.
 * responses:
 * '200':
 * description: A list of the user's tickets.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Ticket'
 */
router.get('/user/:userId', getUserTickets);

export default router;