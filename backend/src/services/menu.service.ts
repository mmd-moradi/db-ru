import { query } from '../db';
import { MenuItem } from './menuItem.service';

// Interface for the Menu "shell" from the cardapios table
export interface Menu {
    cardapio_id: number;
    restaurante_id: number;
    data_cardapio: string; // Stored as 'YYYY-MM-DD'
    tipo_refeicao: 'Cafe da Manha' | 'Almoco' | 'Jantar';
}

// Interface for a complete Menu object, including its items
export interface FullMenu extends Menu {
    items: MenuItem[];
}

/**
 * Creates a new menu shell (an entry in the cardapios table).
 * @param data The data for the new menu.
 * @returns A promise that resolves to the newly created Menu object.
 */
export const create = async (data: Omit<Menu, 'cardapio_id'>): Promise<Menu> => {
    const { restaurante_id, data_cardapio, tipo_refeicao } = data;
    const { rows } = await query(
        'INSERT INTO cardapios (restaurante_id, data_cardapio, tipo_refeicao) VALUES ($1, $2, $3) RETURNING *',
        [restaurante_id, data_cardapio, tipo_refeicao]
    );
    return rows[0];
};

/**
 * Finds a full menu with all its items for a specific restaurant, date, and meal type.
 * @param restaurante_id The ID of the restaurant.
 * @param data_cardapio The date of the menu (e.g., '2025-07-09').
 * @param tipo_refeicao The meal type ('Cafe da Manha', 'Almoco', 'Jantar').
 * @returns A promise that resolves to a FullMenu object or null if not found.
 */
export const findByDate = async (restaurante_id: number, data_cardapio: string, tipo_refeicao: string): Promise<FullMenu | null> => {
    // First, find the menu shell
    const { rows: menuRows } = await query(
        'SELECT * FROM cardapios WHERE restaurante_id = $1 AND data_cardapio = $2 AND tipo_refeicao = $3',
        [restaurante_id, data_cardapio, tipo_refeicao]
    );

    if (menuRows.length === 0) {
        return null; // No menu found for these criteria
    }
    
    const menu: Menu = menuRows[0];
    
    // Now, find all items associated with this menu_id
    const { rows: itemRows } = await query(
        `SELECT i.*, c.nome_categoria FROM itens_cardapio i
         JOIN cardapio_item ci ON i.item_id = ci.item_id
         JOIN categorias_item c ON i.categoria_id = c.categoria_id
         WHERE ci.cardapio_id = $1
         ORDER BY c.nome_categoria, i.nome_item`,
        [menu.cardapio_id]
    );

    return { ...menu, items: itemRows };
};

/**
 * Adds an item to a menu (creates an entry in the cardapio_item join table).
 * @param cardapio_id The ID of the menu.
 * @param item_id The ID of the item to add.
 */
export const addItemToMenu = async (cardapio_id: number, item_id: number): Promise<void> => {
    await query(
        'INSERT INTO cardapio_item (cardapio_id, item_id) VALUES ($1, $2)',
        [cardapio_id, item_id]
    );
};

/**
 * Removes an item from a menu.
 * @param cardapio_id The ID of the menu.
 * @param item_id The ID of the item to remove.
 */
export const removeItemFromMenu = async (cardapio_id: number, item_id: number): Promise<void> => {
    await query(
        'DELETE FROM cardapio_item WHERE cardapio_id = $1 AND item_id = $2',
        [cardapio_id, item_id]
    );
};