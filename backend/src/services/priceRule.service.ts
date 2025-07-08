import { query } from '../db';

// Interface for the PriceRule object
export interface PriceRule {
    regra_id: number;
    grupo_id: number;
    tipo_ticket_id: number;
    preco: number; // Stored as a numeric/decimal type in PG
}

// Interface for creating or updating a price rule
export interface PriceRuleData {
    grupo_id: number;
    tipo_ticket_id: number;
    preco: number;
}

/**
 * Finds all price rules.
 * @returns A promise that resolves to an array of PriceRule objects.
 */
export const findAll = async (): Promise<PriceRule[]> => {
    const { rows } = await query('SELECT * FROM regras_preco ORDER BY regra_id ASC');
    return rows;
};

/**
 * Finds a price rule by its ID.
 * @param id The ID of the price rule.
 * @returns A promise that resolves to a PriceRule object or null if not found.
 */
export const findById = async (id: number): Promise<PriceRule | null> => {
    const { rows } = await query('SELECT * FROM regras_preco WHERE regra_id = $1', [id]);
    return rows[0] || null;
};

/**
 * Creates a new price rule.
 * @param data The data for the new price rule.
 * @returns A promise that resolves to the newly created PriceRule.
 */
export const create = async (data: PriceRuleData): Promise<PriceRule> => {
    const { grupo_id, tipo_ticket_id, preco } = data;
    const { rows } = await query(
        'INSERT INTO regras_preco (grupo_id, tipo_ticket_id, preco) VALUES ($1, $2, $3) RETURNING *',
        [grupo_id, tipo_ticket_id, preco]
    );
    return rows[0];
};

/**
 * Updates an existing price rule.
 * @param id The ID of the rule to update.
 * @param data The new data for the rule.
 * @returns A promise that resolves to the updated PriceRule or null if not found.
 */
export const update = async (id: number, data: PriceRuleData): Promise<PriceRule | null> => {
    const { grupo_id, tipo_ticket_id, preco } = data;
    const { rows } = await query(
        'UPDATE regras_preco SET grupo_id = $1, tipo_ticket_id = $2, preco = $3 WHERE regra_id = $4 RETURNING *',
        [grupo_id, tipo_ticket_id, preco, id]
    );
    return rows[0] || null;
};

/**
 * Removes a price rule.
 * @param id The ID of the rule to remove.
 */
export const remove = async (id: number): Promise<void> => {
    await query('DELETE FROM regras_preco WHERE regra_id = $1', [id]);
};