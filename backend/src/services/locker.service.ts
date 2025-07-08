import { query } from '../db';

// Interface for the Locker object
export interface Locker {
    armario_id: number;
    restaurante_id: number;
    numero_armario: string;
    status: 'Disponivel' | 'Ocupado' | 'Manutencao';
}

// Interface for creating a new locker
export interface LockerCreateData {
    restaurante_id: number;
    numero_armario: string;
    status?: 'Disponivel' | 'Ocupado' | 'Manutencao';
}


/**
 * Finds all lockers, optionally filtered by restaurant or status.
 * @returns A promise that resolves to an array of Locker objects.
 */
export const findAll = async (filters: { restaurante_id?: number, status?: string }): Promise<Locker[]> => {
    let baseQuery = 'SELECT * FROM armarios';
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (filters.restaurante_id) {
        conditions.push(`restaurante_id = $${paramIndex++}`);
        values.push(filters.restaurante_id);
    }
    if (filters.status) {
        conditions.push(`status = $${paramIndex++}`);
        values.push(filters.status);
    }

    if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    baseQuery += ' ORDER BY numero_armario ASC';
    
    const { rows } = await query(baseQuery, values);
    return rows;
};

/**
 * Finds a locker by its ID.
 * @param id The ID of the locker.
 * @returns A promise that resolves to a Locker object or null if not found.
 */
export const findById = async (id: number): Promise<Locker | null> => {
    const { rows } = await query('SELECT * FROM armarios WHERE armario_id = $1', [id]);
    return rows[0] || null;
};

/**
 * Creates a new locker.
 * @param data The data for the new locker.
 * @returns A promise that resolves to the newly created Locker.
 */
export const create = async (data: LockerCreateData): Promise<Locker> => {
    const { restaurante_id, numero_armario, status } = data;
    const { rows } = await query(
        'INSERT INTO armarios (restaurante_id, numero_armario, status) VALUES ($1, $2, $3) RETURNING *',
        [restaurante_id, numero_armario, status || 'Disponivel']
    );
    return rows[0];
};

/**
 * Updates an existing locker's information.
 * @param id The ID of the locker to update.
 * @param data The new data for the locker.
 * @returns A promise that resolves to the updated Locker or null if not found.
 */
export const update = async (id: number, data: Partial<LockerCreateData>): Promise<Locker | null> => {
    const { restaurante_id, numero_armario, status } = data;
    const { rows } = await query(
        'UPDATE armarios SET restaurante_id = $1, numero_armario = $2, status = $3 WHERE armario_id = $4 RETURNING *',
        [restaurante_id, numero_armario, status, id]
    );
    return rows[0] || null;
};

/**
 * Removes a locker.
 * @param id The ID of the locker to remove.
 */
export const remove = async (id: number): Promise<void> => {
    await query('DELETE FROM armarios WHERE armario_id = $1', [id]);
};