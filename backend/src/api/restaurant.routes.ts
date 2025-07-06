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
 * schemas:
 * Restaurante:
 * type: object
 * required:
 * - nome
 * - tipo_cozinha
 * properties:
 * id:
 * type: string
 * format: uuid
 * description: The auto-generated ID of the restaurant.
 * nome:
 * type: string
 * description: The name of the restaurant.
 * endereco:
 * type: string
 * description: The location of the restaurant.
 * tipo_cozinha:
 * type: string
 * description: The type of cuisine offered.
 * created_at:
 * type: string
 * format: date-time
 * description: The creation date of the record.
 * example:
 * id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 * nome: "Restaurante Universitário (RU)"
 * endereco: "Campus Darcy Ribeiro"
 * tipo_cozinha: "Variada"
 * created_at: "2025-07-27T12:34:56.789Z"
 */

/**
 * @swagger
 * tags:
 * name: Restaurantes
 * description: Restaurant management API
 */

/**
 * @swagger
 * /api/restaurantes:
 * get:
 * summary: Returns the list of all restaurants
 * tags: [Restaurantes]
 * responses:
 * 200:
 * description: The list of restaurants.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Restaurante'
 */
router.get('/', getAllRestaurants);

/**
 * @swagger
 * /api/restaurantes/{id}:
 * get:
 * summary: Get a restaurant by ID
 * tags: [Restaurantes]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * format: uuid
 * required: true
 * description: The restaurant ID
 * responses:
 * 200:
 * description: The restaurant data.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Restaurante'
 * 404:
 * description: Restaurant not found.
 */
router.get('/:id', getRestaurantById);

/**
 * @swagger
 * /api/restaurantes:
 * post:
 * summary: Create a new restaurant
 * tags: [Restaurantes]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome:
 * type: string
 * endereco:
 * type: string
 * tipo_cozinha:
 * type: string
 * example:
 * nome: "Cantina da Física"
 * endereco: "Instituto de Física"
 * tipo_cozinha: "Lanches Rápidos"
 * responses:
 * 201:
 * description: The restaurant was successfully created.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Restaurante'
 * 500:
 * description: Server error.
 */
router.post('/', createRestaurant);

/**
 * @swagger
 * /api/restaurantes/{id}:
 * put:
 * summary: Update a restaurant by ID
 * tags: [Restaurantes]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * format: uuid
 * required: true
 * description: The restaurant ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Restaurante'
 * responses:
 * 200:
 * description: Restaurant updated successfully.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Restaurante'
 * 404:
 * description: Restaurant not found.
 * 500:
 * description: Server error.
 */
router.put('/:id', updateRestaurant);

/**
 * @swagger
 * /api/restaurantes/{id}:
 * delete:
 * summary: Delete a restaurant by ID
 * tags: [Restaurantes]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * format: uuid
 * required: true
 * description: The restaurant ID
 * responses:
 * 204:
 * description: Restaurant deleted successfully.
 * 404:
 * description: Restaurant not found.
 */
router.delete('/:id', deleteRestaurant);

export default router;
