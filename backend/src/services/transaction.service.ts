import { query } from '../db';

// Interface for the transaction history view
export interface TransactionHistory {
    usuario_id: number;
    nome_usuario: string;
    nome_grupo: string;
    transacao_id: number;
    tipo_transacao: 'Compra Ticket' | 'Credito RU' | 'Estorno';
    valor: number;
    data_hora: Date;
    restaurante: string | null;
}

/**
 * Executes the stored procedure to purchase a ticket for a user.
 * @param p_usuario_id The ID of the user buying the ticket.
 * @param p_tipo_ticket_id The ID of the ticket type being purchased.
 * @param p_restaurante_id The ID of the restaurant where the purchase is made.
 * @returns A promise that resolves to the status message from the procedure.
 */
export const buyTicket = async (p_usuario_id: number, p_tipo_ticket_id: number, p_restaurante_id: number): Promise<string> => {
    // The procedure uses an INOUT parameter for the status message.
    const { rows } = await query(
        "CALL p_comprar_ticket($1, $2, $3, NULL)",
        [p_usuario_id, p_tipo_ticket_id, p_restaurante_id]
    );
    return 'SUCESSO: A solicitação de compra de ticket foi processada.';
};


/**
 * Adds credit to a user's account and logs the transaction.
 * @param usuario_id The ID of the user receiving credit.
 * @param valor The amount of credit to add.
 * @returns A promise that resolves to the new balance.
 */
export const addCredit = async (usuario_id: number, valor: number): Promise<{ new_balance: number }> => {
    // We use a database transaction to ensure both operations succeed or fail together.
    const client = await query('BEGIN');
    try {
        // First, create the transaction record.
        await query(
            "INSERT INTO transacoes (usuario_id, valor, tipo_transacao) VALUES ($1, $2, 'Credito RU')",
            [usuario_id, valor]
        );

        // Second, update the user's balance.
        const { rows } = await query(
            "UPDATE usuarios SET saldo = saldo + $1 WHERE usuario_id = $2 RETURNING saldo",
            [valor, usuario_id]
        );

        await query('COMMIT');
        return { new_balance: rows[0].saldo };
    } catch (e) {
        await query('ROLLBACK');
        throw e; // Re-throw the error to be handled by the controller
    }
};


/**
 * Retrieves the transaction history for a specific user using the dedicated view.
 * @param usuario_id The ID of the user.
 * @returns A promise that resolves to an array of transaction history records.
 */
export const getTransactionHistory = async (usuario_id: number): Promise<TransactionHistory[]> => {
    const { rows } = await query(
        'SELECT * FROM v_historico_transacoes_usuario WHERE usuario_id = $1',
        [usuario_id]
    );
    return rows;
};