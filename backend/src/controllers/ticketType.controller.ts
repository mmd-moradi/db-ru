import { Request, Response } from 'express';
import * as ticketTypeService from '../services/ticketType.service';

export const getAllTicketTypes = async (req: Request, res: Response) => {
    try {
        const ticketTypes = await ticketTypeService.findAll();
        res.status(200).json(ticketTypes);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching ticket types', error: error.message });
    }
};

export const getTicketTypeById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const ticketType = await ticketTypeService.findById(id);
        if (ticketType) {
            res.status(200).json(ticketType);
        } else {
            res.status(404).json({ message: 'Ticket type not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching ticket type', error: error.message });
    }
};

export const createTicketType = async (req: Request, res: Response) => {
    try {
        const { nome_tipo } = req.body;
        if (!nome_tipo) {
            res.status(400).json({ message: 'nome_tipo is required' });
            return;
        }
        const newTicketType = await ticketTypeService.create(nome_tipo);
        res.status(201).json(newTicketType);
    } catch (error: any) {
        if (error.code === '23505') {
            res.status(409).json({ message: 'Ticket type with this name already exists.' });
            return;
        }
        res.status(500).json({ message: 'Error creating ticket type', error: error.message });
    }
};

export const updateTicketType = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nome_tipo } = req.body;
        if (!nome_tipo) {
            res.status(400).json({ message: 'nome_tipo is required' });
            return;
        }
        const updatedTicketType = await ticketTypeService.update(id, nome_tipo);
        if (updatedTicketType) {
            res.status(200).json(updatedTicketType);
        } else {
            res.status(404).json({ message: 'Ticket type not found to update' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating ticket type', error: error.message });
    }
};

export const deleteTicketType = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await ticketTypeService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Cannot delete ticket type because it is being used by pricing rules or existing tickets.' });
            return;
        }
        res.status(500).json({ message: 'Error deleting ticket type', error: error.message });
    }
};