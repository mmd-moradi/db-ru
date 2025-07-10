import { Router } from 'express';
import {
    createMenu,
    getMenuByDate,
    addItemToMenu,
    removeItemFromMenu,
    deleteMenu,
} from '../controllers/menu.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       properties:
 *         cardapio_id:
 *           type: integer
 *         restaurante_id:
 *           type: integer
 *         data_cardapio:
 *           type: string
 *           format: date
 *         tipo_refeicao:
 *           type: string
 *           enum: [Cafe da Manha, Almoco, Jantar]
 *     FullMenu:
 *       allOf:
 *         - $ref: '#/components/schemas/Menu'
 *         - type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemCardapio'
 */

/**
 * @swagger
 * tags:
 *   - name: Cardápio - Gerenciamento
 *     description: API for assembling and managing daily menus
 */

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: Create a new menu shell (without items)
 *     tags: [Cardápio - Gerenciamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurante_id:
 *                 type: integer
 *               data_cardapio:
 *                 type: string
 *                 format: date
 *                 example: '2025-07-09'
 *               tipo_refeicao:
 *                 type: string
 *                 enum: [Cafe da Manha, Almoco, Jantar]
 *     responses:
 *       '201':
 *         description: Menu shell created successfully.
 *       '409':
 *         description: A menu for this restaurant, date, and meal type already exists.
 */
router.post('/', createMenu);

/**
 * @swagger
 * /api/menus/find:
 *   get:
 *     summary: Find a full menu with all its items by date, restaurant, and meal type
 *     tags: [Cardápio - Gerenciamento]
 *     parameters:
 *       - in: query
 *         name: restaurante_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-07-09"
 *       - in: query
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Cafe da Manha, Almoco, Jantar]
 *     responses:
 *       '200':
 *         description: The full menu with its items.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FullMenu'
 *       '404':
 *         description: Menu not found for the specified criteria.
 */
router.get('/find', getMenuByDate);

/**
 * @swagger
 * /api/menus/{cardapio_id}/items:
 *   post:
 *     summary: Add an item to a specific menu
 *     tags: [Cardápio - Gerenciamento]
 *     parameters:
 *       - in: path
 *         name: cardapio_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Item added to menu successfully.
 *       '404':
 *         description: The specified menu or item does not exist.
 *       '409':
 *         description: This item is already in the menu.
 */
router.post('/:cardapio_id/items', addItemToMenu);

/**
 * @swagger
 * /api/menus/{cardapio_id}/items/{item_id}:
 *   delete:
 *     summary: Remove an item from a specific menu
 *     tags: [Cardápio - Gerenciamento]
 *     parameters:
 *       - in: path
 *         name: cardapio_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Item removed from menu successfully.
 */
router.delete('/:cardapio_id/items/:item_id', removeItemFromMenu);

/**
 * @swagger
 * /api/menus/{cardapio_id}:
 *   delete:
 *     summary: Delete an entire menu
 *     tags: [Cardápio - Gerenciamento]
 *     parameters:
 *       - in: path
 *         name: cardapio_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Menu deleted successfully.
 *       '500':
 *         description: Error deleting menu.
 */
router.delete('/:cardapio_id', deleteMenu);

/**
 * @swagger
 * /api/menus/{cardapio_id}:
 *   delete:
 *     summary: Delete an entire menu
 *     tags: [Cardápio - Gerenciamento]
 *     parameters:
 *       - in: path
 *         name: cardapio_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Menu deleted successfully.
 *       '500':
 *         description: Error deleting menu.
 */
router.delete('/:cardapio_id', deleteMenu);

export default router;