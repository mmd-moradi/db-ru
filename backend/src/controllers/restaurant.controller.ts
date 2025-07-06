import { Request, Response } from 'express';
import * as restaurantService from '../services/restaurant.service';

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await restaurantService.findAll();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.findById(id);
    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const newRestaurant = await restaurantService.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', error });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedRestaurant = await restaurantService.update(id, req.body);
        if (updatedRestaurant) {
            res.status(200).json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found to update' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating restaurant', error });
    }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.findById(id);
    if (!restaurant) {
        res.status(404).json({ message: 'Restaurant not found to delete' });
        return;
    }
    await restaurantService.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant', error });
  }
};