import { query } from '../db';

// Interface for the Restaurant object based on your final schema
export interface Restaurant {
    restaurante_id: number;
    nome_campus: string;
    localizacao: string | null;
    horario_funcionamento: string | null;
}

// Interface for creating or updating a restaurant
export interface RestaurantData {
    nome_campus: string;
    localizacao?: string | null;
    horario_funcionamento?: string | null;
}

/**
 * Finds all restaurants.
 * @returns A promise that resolves to an array of Restaurant objects.
 */
export const findAll = async (): Promise<Restaurant[]> => {
    const { rows } = await query('SELECT * FROM restaurantes ORDER BY nome_campus ASC');
    return rows;
};

/**
 * Finds a restaurant by its ID.
 * @param id The ID of the restaurant.
 * @returns A promise that resolves to a Restaurant object or null if not found.
 */
export const findById = async (id: number): Promise<Restaurant | null> => {
    const { rows } = await query('SELECT * FROM restaurantes WHERE restaurante_id = $1', [id]);
    return rows[0] || null;
};

/**
 * Creates a new restaurant.
 * @param data The data for the new restaurant.
 * @returns A promise that resolves to the newly created Restaurant.
 */
export const create = async (data: RestaurantData): Promise<Restaurant> => {
    const { nome_campus, localizacao, horario_funcionamento } = data;
    const { rows } = await query(
        'INSERT INTO restaurantes (nome_campus, localizacao, horario_funcionamento) VALUES ($1, $2, $3) RETURNING *',
        [nome_campus, localizacao, horario_funcionamento]
    );
    return rows[0];
};

/**
 * Updates an existing restaurant.
 * @param id The ID of the restaurant to update.
 * @param data The new data for the restaurant.
 * @returns A promise that resolves to the updated Restaurant or null if not found.
 */
export const update = async (id: number, data: RestaurantData): Promise<Restaurant | null> => {
    const { nome_campus, localizacao, horario_funcionamento } = data;
    const { rows } = await query(
        'UPDATE restaurantes SET nome_campus = $1, localizacao = $2, horario_funcionamento = $3 WHERE restaurante_id = $4 RETURNING *',
        [nome_campus, localizacao, horario_funcionamento, id]
    );
    return rows[0] || null;
};

/**
 * Removes a restaurant.
 * @param id The ID of the restaurant to remove.
 */
export const remove = async (id: number): Promise<void> => {
    await query('DELETE FROM restaurantes WHERE restaurante_id = $1', [id]);
};