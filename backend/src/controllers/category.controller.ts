import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.findAll();
        res.status(200).json(categories);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const category = await categoryService.findById(id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { nome_categoria } = req.body;
        if (!nome_categoria) {
            res.status(400).json({ message: 'nome_categoria is required' });
            return;
        }
        const newCategory = await categoryService.create(nome_categoria);
        res.status(201).json(newCategory);
    } catch (error: any) {
        if (error.code === '23505') {
            res.status(409).json({ message: 'Category with this name already exists.' });
            return;
        }
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nome_categoria } = req.body;
        if (!nome_categoria) {
            res.status(400).json({ message: 'nome_categoria is required' });
            return;
        }
        const updatedCategory = await categoryService.update(id, nome_categoria);
        if (updatedCategory) {
            res.status(200).json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found to update' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await categoryService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        // Catch foreign key violation error
        if (error.code === '23503') {
            res.status(400).json({ message: 'Cannot delete category because it is being used by one or more menu items.' });
            return;
        }
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};