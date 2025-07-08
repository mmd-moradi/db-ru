import { Request, Response } from 'express';
import * as menuItemService from '../services/menuItem.service';

export const getAllMenuItems = async (req: Request, res: Response) => {
    try {
        const items = await menuItemService.findAll();
        res.status(200).json(items);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching menu items', error: error.message });
    }
};

export const getMenuItemById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const item = await menuItemService.findById(id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching menu item', error: error.message });
    }
};

export const createMenuItem = async (req: Request, res: Response) => {
    try {
        const newItem = await menuItemService.create(req.body);
        res.status(201).json(newItem);
    } catch (error: any) {
        if (error.code === '23503') { // Foreign key violation on categoria_id
            res.status(400).json({ message: 'Invalid categoria_id. The specified category does not exist.' });
            return;
        }
        res.status(500).json({ message: 'Error creating menu item', error: error.message });
    }
};

export const updateMenuItem = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedItem = await menuItemService.update(id, req.body);
        if (updatedItem) {
            res.status(200).json(updatedItem);
        } else {
            res.status(404).json({ message: 'Menu item not found to update' });
        }
    } catch (error: any) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Invalid categoria_id. The specified category does not exist.' });
            return;
        }
        res.status(500).json({ message: 'Error updating menu item', error: error.message });
    }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await menuItemService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Cannot delete item because it is part of an existing menu.' });
            return;
        }
        res.status(500).json({ message: 'Error deleting menu item', error: error.message });
    }
};