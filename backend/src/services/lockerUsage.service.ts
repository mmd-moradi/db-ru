import { query } from '../db';

// Interface for a locker usage record
export interface LockerUsage {
    uso_id: number;
    armario_id: number;
    usuario_id: number;
    data_hora_checkin: Date;
    data_hora_checkout: Date | null;
}

/**
 * Checks a user into a locker.
 * This function is transactional to ensure atomicity.
 * @param armario_id The ID of the locker to check into.
 * @param usuario_id The ID of the user.
 * @returns A promise that resolves to the new usage record.
 */
export const checkIn = async (armario_id: number, usuario_id: number): Promise<LockerUsage> => {
    const client = await query('BEGIN');
    try {
        // Step 1: Check if the locker is available.
        const { rows: lockerRows } = await query(
            'SELECT status FROM armarios WHERE armario_id = $1 FOR UPDATE', // Lock the row
            [armario_id]
        );

        if (lockerRows.length === 0) {
            throw new Error('Locker not found.');
        }
        if (lockerRows[0].status !== 'Disponivel') {
            throw new Error('Locker is not available.');
        }

        // Step 2: Create a new usage record.
        const { rows: usageRows } = await query(
            'INSERT INTO uso_armario (armario_id, usuario_id) VALUES ($1, $2) RETURNING *',
            [armario_id, usuario_id]
        );

        // Step 3: Update the locker's status to 'Ocupado'.
        await query(
            "UPDATE armarios SET status = 'Ocupado' WHERE armario_id = $1",
            [armario_id]
        );

        await query('COMMIT');
        return usageRows[0];
    } catch (e) {
        await query('ROLLBACK');
        throw e; // Re-throw the error to be handled by the controller
    }
};

/**
 * Checks a user out of a locker.
 * This function is transactional.
 * @param armario_id The ID of the locker to check out from.
 * @returns A promise that resolves to the updated (closed) usage record.
 */
export const checkOut = async (armario_id: number): Promise<LockerUsage> => {
    const client = await query('BEGIN');
    try {
        // Step 1: Find the active usage record for this locker (checkout is null).
        const { rows: usageRows } = await query(
            'SELECT uso_id FROM uso_armario WHERE armario_id = $1 AND data_hora_checkout IS NULL FOR UPDATE',
            [armario_id]
        );

        if (usageRows.length === 0) {
            throw new Error('No active check-in found for this locker.');
        }
        const { uso_id } = usageRows[0];

        // Step 2: Update the usage record with the checkout time.
        const { rows: updatedUsageRows } = await query(
            'UPDATE uso_armario SET data_hora_checkout = CURRENT_TIMESTAMP WHERE uso_id = $1 RETURNING *',
            [uso_id]
        );

        // Step 3: Update the locker's status back to 'Disponivel'.
        await query(
            "UPDATE armarios SET status = 'Disponivel' WHERE armario_id = $1",
            [armario_id]
        );
        
        await query('COMMIT');
        return updatedUsageRows[0];
    } catch (e) {
        await query('ROLLBACK');
        throw e;
    }
};

/**
 * Retrieves the history of locker usage.
 * @param filters Optional filters for usuario_id or armario_id.
 * @returns A promise resolving to an array of usage records.
 */
export const getUsageHistory = async(filters: { usuario_id?: number, armario_id?: number }): Promise<LockerUsage[]> => {
    let baseQuery = 'SELECT * FROM uso_armario';
    const conditions = [];
    const values = [];
    let paramIndex = 1;

     if (filters.usuario_id) {
        conditions.push(`usuario_id = $${paramIndex++}`);
        values.push(filters.usuario_id);
    }
    if (filters.armario_id) {
        conditions.push(`armario_id = $${paramIndex++}`);
        values.push(filters.armario_id);
    }
     if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
    }
    baseQuery += ' ORDER BY data_hora_checkin DESC';
    const { rows } = await query(baseQuery, values);
    return rows;
}