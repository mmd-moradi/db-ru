import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.findAll();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const user = await userService.findById(id);
        if (user) {
            // If user has a picture, send it as an image
            if (user.foto_perfil) {
                res.setHeader('Content-Type', 'image/jpeg'); // or the correct mimetype
                res.send(user.foto_perfil);
            } else {
                res.status(200).json(user);
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.create(req.body);
        res.status(201).json(newUser);
    } catch (error: any) {
        // Handle potential unique constraint violation (e.g., email or matricula)
        if (error.code === '23505') {
            res.status(409).json({ message: 'User with this email or matricula already exists.', details: error.detail });
            return;
        }
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedUser = await userService.update(id, req.body);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found to update' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded.' });
            return;
        }
        const user = await userService.updateProfilePicture(id, req.file.buffer);
        if (user) {
            res.status(200).json({ message: 'Profile picture uploaded successfully.', user });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error uploading picture.', error: error.message });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await userService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};