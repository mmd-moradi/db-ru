import { Request, Response } from 'express';
import * as menuService from '../services/menu.service';

export const createMenu = async (req: Request, res: Response) => {
    try {
        const newMenu = await menuService.create(req.body);
        res.status(201).json(newMenu);
    } catch (error: any) {
        if (error.code === '23505') { // unique_violation
            res.status(409).json({ message: 'A menu for this restaurant, date, and meal type already exists.' });
            return;
        }
        if (error.code === '23503') { // foreign_key_violation
            res.status(400).json({ message: 'Invalid restaurante_id.' });
            return;
        }
        res.status(500).json({ message: 'Error creating menu', error: error.message });
    }
};

export const getMenuByDate = async (req: Request, res: Response) => {
    try {
        const { restaurante_id, data, tipo } = req.query;
        if (!restaurante_id || !data || !tipo) {
            res.status(400).json({ message: 'restaurante_id, data, and tipo are required query parameters.' });
            return;
        }

        const menu = await menuService.findByDate(Number(restaurante_id), data as string, tipo as string);
        if (menu) {
            res.status(200).json(menu);
        } else {
            res.status(404).json({ message: 'Menu not found for the specified criteria.' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching menu', error: error.message });
    }
};

export const addItemToMenu = async (req: Request, res: Response) => {
    try {
        const cardapio_id = parseInt(req.params.cardapio_id, 10);
        const { item_id } = req.body;

        if (!item_id) {
            res.status(400).json({ message: 'item_id is required' });
            return;
        }

        await menuService.addItemToMenu(cardapio_id, item_id);
        res.status(201).json({ message: 'Item added to menu successfully.' });
    } catch (error: any) {
        if (error.code === '23503') { // foreign_key_violation
            res.status(404).json({ message: 'The specified menu or item does not exist.' });
            return;
        }
        if (error.code === '23505') { // unique_violation
            res.status(409).json({ message: 'This item is already in this menu.' });
            return;
        }
        res.status(500).json({ message: 'Error adding item to menu', error: error.message });
    }
};

export const removeItemFromMenu = async (req: Request, res: Response) => {
    try {
        const cardapio_id = parseInt(req.params.cardapio_id, 10);
        const item_id = parseInt(req.params.item_id, 10);

        await menuService.removeItemFromMenu(cardapio_id, item_id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: 'Error removing item from menu', error: error.message });
    }
};