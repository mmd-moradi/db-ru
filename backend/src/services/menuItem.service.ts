import { query } from '../db';

// Interface for the MenuItem object based on your schema
export interface MenuItem {
    item_id: number;
    categoria_id: number;
    nome_item: string;
    descricao: string | null;
    alergenicos: string | null;
}

// Interface for creating or updating a menu item
export interface MenuItemData {
    categoria_id: number;
    nome_item: string;
    descricao?: string | null;
    alergenicos?: string | null;
}


/**
 * Finds all menu items.
 * @returns A promise that resolves to an array of MenuItem objects.
 */
export const findAll = async (): Promise<MenuItem[]> => {
    const { rows } = await query('SELECT * FROM itens_cardapio ORDER BY nome_item ASC');
    return rows;
};

/**
 * Finds a menu item by its ID.
 * @param id The ID of the item to find.
 * @returns A promise that resolves to a MenuItem object or null if not found.
 */
export const findById = async (id: number): Promise<MenuItem | null> => {
    const { rows } = await query('SELECT * FROM itens_cardapio WHERE item_id = $1', [id]);
    return rows[0] || null;
};

/**
 * Creates a new menu item.
 * @param data The data for the new item.
 * @returns A promise that resolves to the newly created MenuItem object.
 */
export const create = async (data: MenuItemData): Promise<MenuItem> => {
    const { categoria_id, nome_item, descricao, alergenicos } = data;
    const { rows } = await query(
        'INSERT INTO itens_cardapio (categoria_id, nome_item, descricao, alergenicos) VALUES ($1, $2, $3, $4) RETURNING *',
        [categoria_id, nome_item, descricao, alergenicos]
    );
    return rows[0];
};

/**
 * Updates an existing menu item.
 * @param id The ID of the item to update.
 * @param data The new data for the item.
 * @returns A promise that resolves to the updated MenuItem object or null if not found.
 */
export const update = async (id: number, data: MenuItemData): Promise<MenuItem | null> => {
    const { categoria_id, nome_item, descricao, alergenicos } = data;
    const { rows } = await query(
        'UPDATE itens_cardapio SET categoria_id = $1, nome_item = $2, descricao = $3, alergenicos = $4 WHERE item_id = $5 RETURNING *',
        [categoria_id, nome_item, descricao, alergenicos, id]
    );
    return rows[0] || null;
};

/**
 * Removes a menu item from the database.
 * @param id The ID of the item to remove.
 */
export const remove = async (id: number): Promise<void> => {
    await query('DELETE FROM itens_cardapio WHERE item_id = $1', [id]);
};