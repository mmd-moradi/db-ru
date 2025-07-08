import { Request, Response } from 'express';
import * as groupService from '../services/group.service';

export const getAllGroups = async (req: Request, res: Response) => {
    try {
        const groups = await groupService.findAll();
        res.status(200).json(groups);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching groups', error: error.message });
    }
};

export const getGroupById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const group = await groupService.findById(id);
        if (group) {
            res.status(200).json(group);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching group', error: error.message });
    }
};

export const createGroup = async (req: Request, res: Response) => {
    try {
        const newGroup = await groupService.create(req.body);
        res.status(201).json(newGroup);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating group', error: error.message });
    }
};

export const updateGroup = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedGroup = await groupService.update(id, req.body);
        if (updatedGroup) {
            res.status(200).json(updatedGroup);
        } else {
            res.status(404).json({ message: 'Group not found to update' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating group', error: error.message });
    }
};

export const deleteGroup = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await groupService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting group', error: error.message });
    }
};