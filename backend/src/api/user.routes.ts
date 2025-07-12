import { Router } from 'express';
import multer from 'multer';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    uploadProfilePicture,
} from '../controllers/user.controller';

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         usuario_id:
 *           type: integer
 *           description: Auto-generated ID of the user.
 *         grupo_id:
 *           type: integer
 *           description: ID of the user group they belong to.
 *         nome:
 *           type: string
 *           description: The user's full name.
 *         matricula:
 *           type: string
 *           description: The user's unique registration number.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's unique email address.
 *         saldo:
 *           type: number
 *           format: float
 *           description: The user's current account balance.
 *         data_criacao:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user account was created.
 *       example:
 *         usuario_id: 1
 *         grupo_id: 2
 *         nome: "João da Silva"
 *         matricula: "201010101"
 *         email: "joao.silva@aluno.unb.br"
 *         saldo: 50.50
 *         data_criacao: "2025-07-08T12:00:00.000Z"
 *     UsuarioCreate:
 *       type: object
 *       required:
 *         - grupo_id
 *         - nome
 *         - matricula
 *         - email
 *         - senha_plaintext
 *       properties:
 *         grupo_id:
 *           type: integer
 *           description: ID for the user's group.
 *         nome:
 *           type: string
 *           description: User's full name.
 *         matricula:
 *           type: string
 *           description: User's unique registration number.
 *         email:
 *           type: string
 *           format: email
 *           description: User's unique email.
 *         senha_plaintext:
 *           type: string
 *           format: password
 *           description: User's password in plaintext.
 *         saldo:
 *           type: number
 *           format: float
 *           description: Initial account balance (optional, defaults to 0).
 */

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: API for user management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreate'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       409:
 *         description: User with this email or matricula already exists.
 *       500:
 *         description: Internal server error.
 */
router.post('/', createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Usuários]
 *     description: >
 *       Retrieves user data. If the user has a profile picture, the endpoint returns the image directly 
 *       with a `image/jpeg` content-type. Otherwise, it returns the user's JSON data.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: User data or profile picture.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: User not found.
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's information
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 */
router.put('/:id', updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID.
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete('/:id', deleteUser);

/**
 * @swagger
 * /api/users/{id}/picture:
 *   patch:
 *     summary: Upload or update a user's profile picture
 *     tags: [Usuários]
 *     description: This endpoint handles the binary data upload for a user's profile photo.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The user's profile picture file (e.g., JPEG, PNG).
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully.
 *       400:
 *         description: No file was uploaded.
 *       404:
 *         description: User not found.
 */
router.patch('/:id/picture', upload.single('profilePicture'), uploadProfilePicture);

export default router;