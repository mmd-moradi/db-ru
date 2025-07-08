import { Router } from 'express';
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from '../controllers/employee.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Funcionario:
 *       type: object
 *       required:
 *         - restaurante_id
 *         - nome
 *         - cpf
 *       properties:
 *         funcionario_id:
 *           type: integer
 *           description: Auto-generated ID of the employee.
 *         restaurante_id:
 *           type: integer
 *           description: ID of the restaurant where the employee works.
 *         nome:
 *           type: string
 *           description: The employee's full name.
 *         cpf:
 *           type: string
 *           description: The employee's unique CPF number (11 digits).
 *           example: "12345678901"
 *         cargo:
 *           type: string
 *           description: The employee's job title (e.g., 'Cozinheiro', 'Atendente').
 *         data_contratacao:
 *           type: string
 *           format: date
 *           description: The date the employee was hired.
 *       example:
 *         funcionario_id: 101
 *         restaurante_id: 1
 *         nome: "Maria Oliveira"
 *         cpf: "12345678901"
 *         cargo: "Nutricionista"
 *         data_contratacao: "2024-01-15"
 */

/**
 * @swagger
 * tags:
 *   - name: Funcionários
 *     description: API for managing restaurant employees
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Retrieve a list of employees
 *     tags: [Funcionários]
 *     parameters:
 *       - in: query
 *         name: restauranteId
 *         schema:
 *           type: integer
 *         description: Optional ID to filter employees by restaurant
 *     responses:
 *       200:
 *         description: A list of employees.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcionario'
 */
router.get('/', getAllEmployees);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Funcionários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Funcionario'
 *     responses:
 *       201:
 *         description: Employee created successfully.
 *       400:
 *         description: Invalid input, such as a non-existent restaurante_id.
 *       409:
 *         description: An employee with this CPF already exists.
 */
router.post('/', createEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The employee ID.
 *     responses:
 *       200:
 *         description: Employee data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       404:
 *         description: Employee not found.
 */
router.get('/:id', getEmployeeById);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update an employee's information
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The employee ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Funcionario'
 *     responses:
 *       200:
 *         description: Employee updated successfully.
 *       404:
 *         description: Employee not found.
 */
router.put('/:id', updateEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The employee ID.
 *     responses:
 *       204:
 *         description: Employee deleted successfully.
 *       404:
 *         description: Employee not found.
 */
router.delete('/:id', deleteEmployee);

export default router;