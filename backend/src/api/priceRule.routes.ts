import { Router } from 'express';
import {
    getAllPriceRules,
    getPriceRuleById,
    createPriceRule,
    updatePriceRule,
    deletePriceRule,
} from '../controllers/priceRule.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegraPreco:
 *       type: object
 *       required:
 *         - grupo_id
 *         - tipo_ticket_id
 *         - preco
 *       properties:
 *         regra_id:
 *           type: integer
 *           description: Auto-generated ID of the price rule.
 *         grupo_id:
 *           type: integer
 *           description: The ID of the user group this rule applies to.
 *         tipo_ticket_id:
 *           type: integer
 *           description: The ID of the ticket type this rule applies to.
 *         preco:
 *           type: number
 *           format: float
 *           description: The price for the specified combination.
 *       example:
 *         regra_id: 1
 *         grupo_id: 2
 *         tipo_ticket_id: 2
 *         preco: 6.10
 */

/**
 * @swagger
 * tags:
 *   - name: Transações - Regras de Preço
 *     description: API for managing pricing rules
 */

/**
 * @swagger
 * /api/price-rules:
 *   get:
 *     summary: Retrieve a list of all price rules
 *     tags: [Transações - Regras de Preço]
 *     responses:
 *       '200':
 *         description: A list of price rules.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegraPreco'
 *   post:
 *     summary: Create a new price rule
 *     tags: [Transações - Regras de Preço]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegraPreco'
 *     responses:
 *       '201':
 *         description: Price rule created successfully.
 *       '400':
 *         description: Invalid input, such as a non-existent group or ticket type ID.
 *       '409':
 *         description: A rule for this group and ticket type combination already exists.
 */
router.route('/').get(getAllPriceRules).post(createPriceRule);

/**
 * @swagger
 * /api/price-rules/{id}:
 *   get:
 *     summary: Get a price rule by ID
 *     tags: [Transações - Regras de Preço]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The price rule ID.
 *     responses:
 *       '200':
 *         description: Price rule data.
 *       '404':
 *         description: Price rule not found.
 *   put:
 *     summary: Update a price rule
 *     tags: [Transações - Regras de Preço]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The price rule ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegraPreco'
 *     responses:
 *       '200':
 *         description: Price rule updated successfully.
 *       '404':
 *         description: Price rule not found.
 *   delete:
 *     summary: Delete a price rule
 *     tags: [Transações - Regras de Preço]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The price rule ID.
 *     responses:
 *       '204':
 *         description: Price rule deleted successfully.
 *       '404':
 *         description: Price rule not found.
 */
router.route('/:id').get(getPriceRuleById).put(updatePriceRule).delete(deletePriceRule);

export default router;