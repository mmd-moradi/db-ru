import { query } from '../db';

// Interface for the Category object
export interface Category {
    categoria_id: number;
    nome_categoria: string;
}

/**
 * Finds all item categories.
 * @returns A promise that resolves to an array of Category objects.
 */
export const findAll = async (): Promise<Category[]> => {
    const { rows } = await query('SELECT * FROM categorias_item ORDER BY nome_categoria ASC');
    return rows;
};

/**
 * Finds an item category by its ID.
 * @param id The ID of the category to find.
 * @returns A promise that resolves to a Category object or null if not found.
 */
export const findById = async (id: number): Promise<Category | null> => {
    const { rows } = await query('SELECT * FROM categorias_item WHERE categoria_id = $1', [id]);
    return rows[0] || null;
};

/**
 * Creates a new item category.
 * @param name The name for the new category.
 * @returns A promise that resolves to the newly created Category object.
 */
export const create = async (name: string): Promise<Category> => {
    const { rows } = await query(
        'INSERT INTO categorias_item (nome_categoria) VALUES ($1) RETURNING *',
        [name]
    );
    return rows[0];
};

/**
 * Updates an existing item category.
 * @param id The ID of the category to update.
 * @param name The new name for the category.
 * @returns A promise that resolves to the updated Category object or null if not found.
 */
export const update = async (id: number, name: string): Promise<Category | null> => {
    const { rows } = await query(
        'UPDATE categorias_item SET nome_categoria = $1 WHERE categoria_id = $2 RETURNING *',
        [name, id]
    );
    return rows[0] || null;
};

/**
 * Removes an item category from the database.
 * @param id The ID of the category to remove.
 */
export const remove = async (id: number): Promise<void> => {
    await query('DELETE FROM categorias_item WHERE categoria_id = $1', [id]);
};