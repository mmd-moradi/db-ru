import { query } from '../db';

// Interface for the TicketType object
export interface TicketType {
    tipo_ticket_id: number;
    nome_tipo: string;
}

/**
 * Finds all ticket types.
 * @returns A promise that resolves to an array of TicketType objects.
 */
export const findAll = async (): Promise<TicketType[]> => {
    const { rows } = await query('SELECT * FROM tipos_ticket ORDER BY tipo_ticket_id ASC');
    return rows;
};

/**
 * Finds a ticket type by its ID.
 * @param id The ID of the ticket type.
 * @returns A promise that resolves to a TicketType object or null if not found.
 */
export const findById = async (id: number): Promise<TicketType | null> => {
    const { rows } = await query('SELECT * FROM tipos_ticket WHERE tipo_ticket_id = $1', [id]);
    return rows[0] || null;
};

/**
 * Creates a new ticket type.
 * @param name The name of the new ticket type.
 * @returns A promise that resolves to the newly created TicketType.
 */
export const create = async (name: string): Promise<TicketType> => {
    const { rows } = await query(
        'INSERT INTO tipos_ticket (nome_tipo) VALUES ($1) RETURNING *',
        [name]
    );
    return rows[0];
};

/**
 * Updates an existing ticket type.
 * @param id The ID of the ticket type to update.
 * @param name The new name for the ticket type.
 * @returns A promise that resolves to the updated TicketType or null if not found.
 */
export const update = async (id: number, name: string): Promise<TicketType | null> => {
    const { rows } = await query(
        'UPDATE tipos_ticket SET nome_tipo = $1 WHERE tipo_ticket_id = $2 RETURNING *',
        [name, id]
    );
    return rows[0] || null;
};

/**
 * Removes a ticket type.
 * @param id The ID of the ticket type to remove.
 */
export const remove = async (id: number): Promise<void> => {
    await query('DELETE FROM tipos_ticket WHERE tipo_ticket_id = $1', [id]);
};