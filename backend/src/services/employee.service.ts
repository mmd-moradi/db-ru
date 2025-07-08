import { query } from '../db';

// Interface for the Employee object based on your schema
export interface Employee {
    funcionario_id: number;
    restaurante_id: number;
    nome: string;
    cpf: string;
    cargo: string | null;
    data_contratacao: string | null; // Keep as string for simplicity, pg driver handles date conversion
}

// Interface for creating a new employee
export interface EmployeeCreateData {
    restaurante_id: number;
    nome: string;
    cpf: string;
    cargo?: string;
    data_contratacao?: string; // e.g., 'YYYY-MM-DD'
}

/**
 * Finds all employees, optionally filtered by restaurant.
 * @param restauranteId - Optional ID of the restaurant to filter by.
 * @returns A promise that resolves to an array of Employee objects.
 */
export const findAll = async (restauranteId?: number): Promise<Employee[]> => {
    let baseQuery = 'SELECT * FROM funcionarios';
    const queryParams = [];

    if (restauranteId) {
        baseQuery += ' WHERE restaurante_id = $1';
        queryParams.push(restauranteId);
    }

    baseQuery += ' ORDER BY nome ASC';
    
    const { rows } = await query(baseQuery, queryParams);
    return rows;
};

/**
 * Finds an employee by their ID.
 * @param id The ID of the employee to find.
 * @returns A promise that resolves to an Employee object or null if not found.
 */
export const findById = async (id: number): Promise<Employee | null> => {
    const { rows } = await query('SELECT * FROM funcionarios WHERE funcionario_id = $1', [id]);
    return rows[0] || null;
};

/**
 * Creates a new employee.
 * @param data The data for the new employee.
 * @returns A promise that resolves to the newly created Employee object.
 */
export const create = async (data: EmployeeCreateData): Promise<Employee> => {
    const { restaurante_id, nome, cpf, cargo, data_contratacao } = data;
    const { rows } = await query(
        'INSERT INTO funcionarios (restaurante_id, nome, cpf, cargo, data_contratacao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [restaurante_id, nome, cpf, cargo, data_contratacao]
    );
    return rows[0];
};

/**
 * Updates an existing employee.
 * @param id The ID of the employee to update.
 * @param data The new data for the employee.
 * @returns A promise that resolves to the updated Employee object or null if not found.
 */
export const update = async (id: number, data: Partial<EmployeeCreateData>): Promise<Employee | null> => {
    const { restaurante_id, nome, cpf, cargo, data_contratacao } = data;
    const { rows } = await query(
        'UPDATE funcionarios SET restaurante_id = $1, nome = $2, cpf = $3, cargo = $4, data_contratacao = $5 WHERE funcionario_id = $6 RETURNING *',
        [restaurante_id, nome, cpf, cargo, data_contratacao, id]
    );
    return rows[0] || null;
};

/**
 * Removes an employee from the database.
 * @param id The ID of the employee to remove.
 */
export const remove = async (id: number): Promise<void> => {
    await query('DELETE FROM funcionarios WHERE funcionario_id = $1', [id]);
};