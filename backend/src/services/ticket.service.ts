import { query } from '../db';

// Interface for the Ticket object
export interface Ticket {
    ticket_id: number;
    usuario_id: number;
    transacao_id: number;
    tipo_ticket_id: number;
}

/**
 * Finds all tickets. Useful for an admin view.
 * @returns A promise that resolves to an array of Ticket objects.
 */
export const findAll = async (): Promise<Ticket[]> => {
    // Joining with other tables to provide more context
    const { rows } = await query(`
        SELECT 
            t.ticket_id, 
            t.usuario_id, 
            u.nome AS nome_usuario,
            t.transacao_id, 
            t.tipo_ticket_id, 
            tt.nome_tipo,
            tr.data_hora AS data_compra
        FROM tickets t
        JOIN usuarios u ON t.usuario_id = u.usuario_id
        JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.tipo_ticket_id
        JOIN transacoes tr ON t.transacao_id = tr.transacao_id
        ORDER BY tr.data_hora DESC
    `);
    return rows;
};

/**
 * Finds all tickets belonging to a specific user.
 * @param usuario_id The ID of the user.
 * @returns A promise that resolves to an array of the user's tickets.
 */
export const findByUser = async (usuario_id: number): Promise<Ticket[]> => {
    const { rows } = await query(`
        SELECT 
            t.ticket_id, 
            t.usuario_id, 
            t.transacao_id, 
            t.tipo_ticket_id, 
            tt.nome_tipo,
            tr.data_hora AS data_compra
        FROM tickets t
        JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.tipo_ticket_id
        JOIN transacoes tr ON t.transacao_id = tr.transacao_id
        WHERE t.usuario_id = $1
        ORDER BY tr.data_hora DESC
    `, [usuario_id]);
    return rows;
};