import { Request, Response } from 'express';
import * as restaurantService from '../services/restaurant.service';

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await restaurantService.findAll();
        res.status(200).json(restaurants);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
};

export const getRestaurantById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const restaurant = await restaurantService.findById(id);
        if (restaurant) {
            res.status(200).json(restaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
    }
};

export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const newRestaurant = await restaurantService.create(req.body);
        res.status(201).json(newRestaurant);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating restaurant', error: error.message });
    }
};

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedRestaurant = await restaurantService.update(id, req.body);
        if (updatedRestaurant) {
            res.status(200).json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found to update' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating restaurant', error: error.message });
    }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await restaurantService.remove(id);
        res.status(204).send();
    } catch (error: any)
    {
        if (error.code === '23503') {
            res.status(400).json({ message: 'Cannot delete restaurant as it is referenced by employees, menus, or other records.' });
            return;
        }
        res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
    }
};