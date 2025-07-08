import { Router } from 'express';
import { 
  getAllCategories, 
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory 
} from '../controllers/category.controller';

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     CategoriaItem:
 *       type: object
 *       required:
 *         - nome_categoria
 *       properties:
 *         categoria_id:
 *           type: integer
 *           description: Auto-generated ID of the category.
 *         nome_categoria:
 *           type: string
 *           description: The name of the category (e.g., 'Prato Principal', 'Bebida').
 *       example:
 *         categoria_id: 1
 *         nome_categoria: "Prato Principal"
 *   tags:
 *     - name: Cardápio
 *       description: API for menu management
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of all item categories
 *     tags: [Cardápio]
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoriaItem'
 *   post:
 *     summary: Create a new item category
 *     tags: [Cardápio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaItem'
 *     responses:
 *       201:
 *         description: Category created successfully.
 */
router.route('/').get(getAllCategories).post(createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Cardápio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaItem'
 *       404:
 *         description: Category not found
 *   put:
 *     summary: Update a category
 *     tags: [Cardápio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaItem'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete a category
 *     tags: [Cardápio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the category
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;