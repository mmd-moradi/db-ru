import { query } from '../db';

// Interface to define the structure of a restaurant object
export interface Restaurant {
  id: string;
  nome: string;
  endereco: string;
  tipo_cozinha: string;
  created_at: Date;
}

// Interface for the data needed to create a new restaurant
export interface RestaurantCreateData {
  nome: string;
  endereco: string;
  tipo_cozinha: string;
}

export const findAll = async (): Promise<Restaurant[]> => {
  const { rows } = await query('SELECT * FROM restaurantes ORDER BY created_at DESC');
  return rows;
};


export const findById = async (id: string): Promise<Restaurant | null> => {
  const { rows } = await query('SELECT * FROM restaurantes WHERE id = $1', [id]);
  return rows[0] || null;
};


export const create = async (data: RestaurantCreateData): Promise<Restaurant> => {
  const { nome, endereco, tipo_cozinha } = data;
  const { rows } = await query(
    'INSERT INTO restaurantes (nome, endereco, tipo_cozinha) VALUES ($1, $2, $3) RETURNING *',
    [nome, endereco, tipo_cozinha]
  );
  return rows[0];
};


export const update = async (id: string, data: Partial<RestaurantCreateData>): Promise<Restaurant | null> => {
    const { nome, endereco, tipo_cozinha } = data;
    const { rows } = await query(
        'UPDATE restaurantes SET nome = $1, endereco = $2, tipo_cozinha = $3 WHERE id = $4 RETURNING *',
        [nome, endereco, tipo_cozinha, id]
    );
    return rows[0] || null;
};


export const remove = async (id: string): Promise<void> => {
  await query('DELETE FROM restaurantes WHERE id = $1', [id]);
};
