import { Router } from 'express';
import { checkIn, checkOut, getHistory } from '../controllers/lockerUsage.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Armários - Uso
 *     description: API for checking lockers in and out
 */

/**
 * @swagger
 * /api/locker-usage/check-in:
 *   post:
 *     summary: Check a user into a locker
 *     tags: [Armários - Uso]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               armario_id:
 *                 type: integer
 *               usuario_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Check-in successful.
 *       '400':
 *         description: Check-in failed (e.g., locker not available, user not found).
 */
router.post('/check-in', checkIn);

/**
 * @swagger
 * /api/locker-usage/check-out:
 *   post:
 *     summary: Check a user out of a locker
 *     tags: [Armários - Uso]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               armario_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Check-out successful.
 *       '400':
 *         description: Check-out failed (e.g., no active check-in found).
 */
router.post('/check-out', checkOut);

/**
 * @swagger
 * /api/locker-usage/history:
 *   get:
 *     summary: Get locker usage history
 *     tags: [Armários - Uso]
 *     parameters:
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         description: Optional user ID to filter history.
 *       - in: query
 *         name: armario_id
 *         schema:
 *           type: integer
 *         description: Optional locker ID to filter history.
 *     responses:
 *       '200':
 *         description: A list of locker usage records.
 */
router.get('/history', getHistory);

export default router;