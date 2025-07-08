import { Request, Response } from 'express';
import * as priceRuleService from '../services/priceRule.service';

export const getAllPriceRules = async (req: Request, res: Response) => {
    try {
        const rules = await priceRuleService.findAll();
        res.status(200).json(rules);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching price rules', error: error.message });
    }
};

export const getPriceRuleById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const rule = await priceRuleService.findById(id);
        if (rule) {
            res.status(200).json(rule);
        } else {
            res.status(404).json({ message: 'Price rule not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching price rule', error: error.message });
    }
};

export const createPriceRule = async (req: Request, res: Response) => {
    try {
        const newRule = await priceRuleService.create(req.body);
        res.status(201).json(newRule);
    } catch (error: any) {
        if (error.code === '23505') { // unique_violation on (grupo_id, tipo_ticket_id)
            res.status(409).json({ message: 'A price rule for this user group and ticket type already exists.' });
            return;
        }
        if (error.code === '23503') { // foreign_key_violation
            res.status(400).json({ message: 'Invalid grupo_id or tipo_ticket_id.' });
            return;
        }
        res.status(500).json({ message: 'Error creating price rule', error: error.message });
    }
};

export const updatePriceRule = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedRule = await priceRuleService.update(id, req.body);
        if (updatedRule) {
            res.status(200).json(updatedRule);
        } else {
            res.status(404).json({ message: 'Price rule not found to update' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating price rule', error: error.message });
    }
};

export const deletePriceRule = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await priceRuleService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting price rule', error: error.message });
    }
};