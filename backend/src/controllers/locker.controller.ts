import { Request, Response } from 'express';
import * as lockerService from '../services/locker.service';

export const getAllLockers = async (req: Request, res: Response) => {
    try {
        const { restaurante_id, status } = req.query;
        const filters = {
            restaurante_id: restaurante_id ? Number(restaurante_id) : undefined,
            status: status as string | undefined
        };
        const lockers = await lockerService.findAll(filters);
        res.status(200).json(lockers);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching lockers', error: error.message });
    }
};

export const getLockerById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const locker = await lockerService.findById(id);
        if (locker) {
            res.status(200).json(locker);
        } else {
            res.status(404).json({ message: 'Locker not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching locker', error: error.message });
    }
};

export const createLocker = async (req: Request, res: Response) => {
    try {
        const newLocker = await lockerService.create(req.body);
        res.status(201).json(newLocker);
    } catch (error: any) {
        if (error.code === '23505') { // unique_violation on (restaurante_id, numero_armario)
            res.status(409).json({ message: 'A locker with this number already exists in this restaurant.' });
            return;
        }
        if (error.code === '23503') { // foreign_key_violation on restaurante_id
            res.status(400).json({ message: 'Invalid restaurante_id.' });
            return;
        }
        res.status(500).json({ message: 'Error creating locker', error: error.message });
    }
};

export const updateLocker = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedLocker = await lockerService.update(id, req.body);
        if (updatedLocker) {
            res.status(200).json(updatedLocker);
        } else {
            res.status(404).json({ message: 'Locker not found to update' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating locker', error: error.message });
    }
};

export const deleteLocker = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await lockerService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Cannot delete locker as it has usage history.' });
            return;
        }
        res.status(500).json({ message: 'Error deleting locker', error: error.message });
    }
};