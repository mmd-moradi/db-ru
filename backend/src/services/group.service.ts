import { query } from '../db';

// Interface for the Group object based on your schema
export interface Group {
    grupo_id: number;
    nome_grupo: string;
    descricao: string | null;
}

// Interface for creating a new group
export interface GroupCreateData {
    nome_grupo: string;
    descricao?: string;
}

/**
 * Finds all user groups.
 * @returns A promise that resolves to an array of Group objects.
 */
export const findAll = async (): Promise<Group[]> => {
    const { rows } = await query('SELECT * FROM grupos_usuario ORDER BY grupo_id ASC');
    return rows;
};

/**
 * Finds a user group by its ID.
 * @param id The ID of the group to find.
 * @returns A promise that resolves to a Group object or null if not found.
 */
export const findById = async (id: number): Promise<Group | null> => {
    const { rows } = await query('SELECT * FROM grupos_usuario WHERE grupo_id = $1', [id]);
    return rows[0] || null;
};

/**
 * Creates a new user group.
 * @param data The data for the new group.
 * @returns A promise that resolves to the newly created Group object.
 */
export const create = async (data: GroupCreateData): Promise<Group> => {
    const { nome_grupo, descricao } = data;
    const { rows } = await query(
        'INSERT INTO grupos_usuario (nome_grupo, descricao) VALUES ($1, $2) RETURNING *',
        [nome_grupo, descricao]
    );
    return rows[0];
};

/**
 * Updates an existing user group.
 * @param id The ID of the group to update.
 * @param data The new data for the group.
 * @returns A promise that resolves to the updated Group object or null if not found.
 */
export const update = async (id: number, data: Partial<GroupCreateData>): Promise<Group | null> => {
    const { nome_grupo, descricao } = data;
    // Build the update query dynamically based on provided fields
    const { rows } = await query(
        'UPDATE grupos_usuario SET nome_grupo = $1, descricao = $2 WHERE grupo_id = $3 RETURNING *',
        [nome_grupo, descricao, id]
    );
    return rows[0] || null;
};

/**
 * Removes a user group from the database.
 * @param id The ID of the group to remove.
 */
export const remove = async (id: number): Promise<void> => {
    await query('DELETE FROM grupos_usuario WHERE grupo_id = $1', [id]);
};