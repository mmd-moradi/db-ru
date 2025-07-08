import { Router } from 'express';
import {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} from '../controllers/menuItem.controller';

const router = Router();

/**
 * @swagger
 * components:
 * schemas:
 * ItemCardapio:
 * type: object
 * required:
 * - categoria_id
 * - nome_item
 * properties:
 * item_id:
 * type: integer
 * description: Auto-generated ID of the item.
 * categoria_id:
 * type: integer
 * description: The category this item belongs to.
 * nome_item:
 * type: string
 * description: The name of the food item.
 * descricao:
 * type: string
 * description: A brief description of the item.
 * alergenicos:
 * type: string
 * description: List of allergens.
 * example: "Trigo, Leite e derivados"
 * example:
 * item_id: 101
 * categoria_id: 1
 * nome_item: "Strogonoff de frango"
 * descricao: "Cubos de frango ao molho cremoso."
 * alergenicos: "Leite e derivados"
 */

/**
 * @swagger
 * tags:
 * - name: Cardápio - Itens
 * description: API for managing individual food items
 */

/**
 * @swagger
 * /api/menu-items:
 * get:
 * summary: Retrieve a list of all menu items
 * tags: [Cardápio - Itens]
 * responses:
 * 200:
 * description: A list of all food items.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/ItemCardapio'
 * post:
 * summary: Create a new menu item
 * tags: [Cardápio - Itens]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ItemCardapio'
 * responses:
 * 201:
 * description: Menu item created successfully.
 * 400:
 * description: Invalid 'categoria_id'.
 */
router.route('/').get(getAllMenuItems).post(createMenuItem);

/**
 * @swagger
 * /api/menu-items/{id}:
 * get:
 * summary: Get a menu item by ID
 * tags: [Cardápio - Itens]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: The menu item ID.
 * responses:
 * 200:
 * description: Menu item data.
 * 404:
 * description: Menu item not found.
 * put:
 * summary: Update a menu item
 * tags: [Cardápio - Itens]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: The menu item ID.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ItemCardapio'
 * responses:
 * 200:
 * description: Menu item updated successfully.
 * 404:
 * description: Menu item not found.
 * delete:
 * summary: Delete a menu item
 * tags: [Cardápio - Itens]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: The menu item ID.
 * responses:
 * 204:
 * description: Menu item deleted successfully.
 * 400:
 * description: Cannot delete item, it is in use.
 * 404:
 * description: Menu item not found.
 */
router.route('/:id').get(getMenuItemById).put(updateMenuItem).delete(deleteMenuItem);

export default router;