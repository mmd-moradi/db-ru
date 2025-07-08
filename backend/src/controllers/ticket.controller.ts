import { Request, Response } from 'express';
import * as ticketService from '../services/ticket.service';

export const getAllTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await ticketService.findAll();
        res.status(200).json(tickets);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};

export const getUserTickets = async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params.userId, 10);
        const tickets = await ticketService.findByUser(usuario_id);
        res.status(200).json(tickets);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching user tickets', error: error.message });
    }
};