import { Request, Response } from 'express';
import * as lockerUsageService from '../services/lockerUsage.service';

export const checkIn = async (req: Request, res: Response) => {
    try {
        const { armario_id, usuario_id } = req.body;
        if (!armario_id || !usuario_id) {
            res.status(400).json({ message: 'armario_id and usuario_id are required.' });
            return;
        }
        const usageRecord = await lockerUsageService.checkIn(armario_id, usuario_id);
        res.status(201).json({ message: 'Check-in successful.', data: usageRecord });
    } catch (error: any) {
        res.status(400).json({ message: 'Check-in failed.', error: error.message });
    }
};

export const checkOut = async (req: Request, res: Response) => {
    try {
        const { armario_id } = req.body;
        if (!armario_id) {
            res.status(400).json({ message: 'armario_id is required.' });
            return;
        }
        const usageRecord = await lockerUsageService.checkOut(armario_id);
        res.status(200).json({ message: 'Check-out successful.', data: usageRecord });
    } catch (error: any) {
        res.status(400).json({ message: 'Check-out failed.', error: error.message });
    }
};

export const getHistory = async(req: Request, res: Response) => {
    try {
        const { usuario_id, armario_id } = req.query;
        const history = await lockerUsageService.getUsageHistory({
            usuario_id: usuario_id ? Number(usuario_id) : undefined,
            armario_id: armario_id ? Number(armario_id) : undefined,
        });
        res.status(200).json(history);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get usage history.', error: error.message });
    }
}