import { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service';

export const buyTicket = async (req: Request, res: Response) => {
    try {
        const { usuario_id, tipo_ticket_id, restaurante_id } = req.body;
        if (!usuario_id || !tipo_ticket_id || !restaurante_id) {
            res.status(400).json({ message: 'usuario_id, tipo_ticket_id, and restaurante_id are required.' });
            return;
        }
        
        const message = await transactionService.buyTicket(usuario_id, tipo_ticket_id, restaurante_id);
        
        // Since we can't easily get the INOUT param, we check for errors in the service.
        // If the procedure raises an exception (e.g., saldo insuficiente), it will be caught below.
        res.status(200).json({ message });

    } catch (error: any) {
        // The procedure might return a custom error message.
        if (error.message.includes('Saldo insuficiente')) {
             res.status(402).json({ message: 'FALHA: Saldo insuficiente para realizar a compra.' });
              return;
        }
        if (error.message.includes('Usuario nao encontrado')) {
             res.status(404).json({ message: 'ERRO: Usuario nao encontrado.' });
              return;
        }
        res.status(500).json({ message: 'Error processing ticket purchase', error: error.message });
    }
};

export const addCredit = async (req: Request, res: Response) => {
    try {
        const { usuario_id, valor } = req.body;
        if (!usuario_id || !valor || valor <= 0) {
            res.status(400).json({ message: 'A valid usuario_id and a positive valor are required.' });
            return;
        }

        const result = await transactionService.addCredit(usuario_id, valor);
        res.status(200).json({ message: 'Credit added successfully.', ...result });

    } catch (error: any) {
        if (error.code === '23503') { // User does not exist
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(500).json({ message: 'Error adding credit', error: error.message });
    }
};

export const getUserTransactionHistory = async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params.userId, 10);
        const history = await transactionService.getTransactionHistory(usuario_id);
        res.status(200).json(history);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching transaction history', error: error.message });
    }
};