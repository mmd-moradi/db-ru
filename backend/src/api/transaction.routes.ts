import { Router } from 'express';
import {
    buyTicket,
    addCredit,
    getUserTransactionHistory,
} from '../controllers/transaction.controller';

const router = Router();

/**
 * @swagger
 * tags:
 * - name: Transações - Ações
 * description: API for performing transactions like buying tickets and adding credit
 */

/**
 * @swagger
 * /api/transactions/buy-ticket:
 * post:
 * summary: Purchase a meal ticket for a user
 * description: This endpoint calls the p_comprar_ticket stored procedure to handle the purchase logic.
 * tags: [Transações - Ações]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * usuario_id:
 * type: integer
 * tipo_ticket_id:
 * type: integer
 * restaurante_id:
 * type: integer
 * responses:
 * '200':
 * description: Purchase request processed.
 * '402':
 * description: Insufficient funds.
 * '404':
 * description: User not found.
 */
router.post('/buy-ticket', buyTicket);

/**
 * @swagger
 * /api/transactions/add-credit:
 * post:
 * summary: Add credit to a user's balance
 * description: This creates a 'Credito RU' transaction and updates the user's saldo.
 * tags: [Transações - Ações]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * usuario_id:
 * type: integer
 * valor:
 * type: number
 * format: float
 * responses:
 * '200':
 * description: Credit added successfully.
 * '404':
 * description: User not found.
 */
router.post('/add-credit', addCredit);

/**
 * @swagger
 * /api/transactions/history/{userId}:
 * get:
 * summary: Get the transaction history for a specific user
 * description: This endpoint queries the v_historico_transacoes_usuario view.
 * tags: [Transações - Ações]
 * parameters:
 * - in: path
 * name: userId
 * schema:
 * type: integer
 * required: true
 * description: The user's ID.
 * responses:
 * '200':
 * description: A list of the user's transactions.
 */
router.get('/history/:userId', getUserTransactionHistory);

export default router;