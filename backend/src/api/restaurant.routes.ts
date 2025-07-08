import { Router } from 'express';
import {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
} from '../controllers/restaurant.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurante:
 *       type: object
 *       required:
 *         - nome_campus
 *       properties:
 *         restaurante_id:
 *           type: integer
 *           description: Auto-generated ID of the restaurant.
 *         nome_campus:
 *           type: string
 *           description: The name of the campus where the restaurant is located (e.g., 'Darcy Ribeiro', 'Gama').
 *         localizacao:
 *           type: string
 *           description: Specific location details of the restaurant on campus.
 *         horario_funcionamento:
 *           type: string
 *           description: The operating hours of the restaurant.
 *       example:
 *         restaurante_id: 1
 *         nome_campus: "Darcy Ribeiro"
 *         localizacao: "Próximo ao ICC Norte"
 *         horario_funcionamento: "Seg-Sex: 07:00-21:00"
 */

/**
 * @swagger
 * tags:
 *   - name: Restaurantes
 *     description: API for managing university restaurants
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Retrieve a list of all restaurants
 *     tags: [Restaurantes]
 *     responses:
 *       '200':
 *         description: A list of restaurants.
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurante'
 *     responses:
 *       '201':
 *         description: Restaurant created successfully.
 */
router.route('/').get(getAllRestaurants).post(createRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The restaurant ID.
 *     responses:
 *       '200':
 *         description: Restaurant data.
 *       '404':
 *         description: Restaurant not found.
 *   put:
 *     summary: Update a restaurant's information
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The restaurant ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurante'
 *     responses:
 *       '200':
 *         description: Restaurant updated successfully.
 *       '404':
 *         description: Restaurant not found.
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The restaurant ID.
 *     responses:
 *       '204':
 *         description: Restaurant deleted successfully.
 *       '400':
 *         description: Cannot delete restaurant as it's being referenced by other records.
 */
router.route('/:id').get(getRestaurantById).put(updateRestaurant).delete(deleteRestaurant);

export default router;