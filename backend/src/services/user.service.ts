import { query } from '../db';
import bcrypt from 'bcryptjs';

// Interface for the User object
export interface User {
    usuario_id: number;
    grupo_id: number;
    nome: string;
    matricula: string;
    email: string;
    senha_hash: string;
    saldo: number;
    foto_perfil: Buffer | null;
    data_criacao: Date;
}

// Interface for creating a new user (omits auto-generated fields)
export interface UserCreateData {
    grupo_id: number;
    nome: string;
    matricula: string;
    email: string;
    senha_plaintext: string; // We'll receive a plaintext password to be hashed
    saldo?: number;
}

export const findAll = async (): Promise<Omit<User, 'senha_hash' | 'foto_perfil'>[]> => {
    // Exclude sensitive data from the general list
    const { rows } = await query('SELECT usuario_id, grupo_id, nome, matricula, email, saldo, data_criacao FROM usuarios ORDER BY nome ASC');
    return rows;
};

export const findById = async (id: number): Promise<Omit<User, 'senha_hash'> | null> => {
    // Exclude password hash from the response
    const { rows } = await query('SELECT usuario_id, grupo_id, nome, matricula, email, saldo, foto_perfil, data_criacao FROM usuarios WHERE usuario_id = $1', [id]);
    return rows[0] || null;
};

export const create = async (data: UserCreateData): Promise<Omit<User, 'senha_hash'>> => {
    const { grupo_id, nome, matricula, email, senha_plaintext, saldo } = data;
    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha_plaintext, salt);

    const { rows } = await query(
        'INSERT INTO usuarios (grupo_id, nome, matricula, email, senha_hash, saldo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING usuario_id, grupo_id, nome, matricula, email, saldo, data_criacao',
        [grupo_id, nome, matricula, email, senha_hash, saldo || 0.00]
    );
    return rows[0];
};

export const update = async (id: number, data: Partial<UserCreateData>): Promise<Omit<User, 'senha_hash'> | null> => {
    const { nome, email, grupo_id, saldo } = data;
    const { rows } = await query(
        'UPDATE usuarios SET nome = $1, email = $2, grupo_id = $3, saldo = $4 WHERE usuario_id = $5 RETURNING usuario_id, grupo_id, nome, matricula, email, saldo, data_criacao',
        [nome, email, grupo_id, saldo, id]
    );
    return rows[0] || null;
};

/**
 * This specifically handles updating the user's profile picture 
 * @param id The user's ID
 * @param fileBuffer The image buffer from the uploaded file
 * @returns The updated user object, or null
 */
export const updateProfilePicture = async (id: number, fileBuffer: Buffer): Promise<Pick<User, 'usuario_id' | 'nome'> | null> => {
    const { rows } = await query(
        'UPDATE usuarios SET foto_perfil = $1 WHERE usuario_id = $2 RETURNING usuario_id, nome',
        [fileBuffer, id]
    );
    return rows[0] || null;
}

export const remove = async (id: number): Promise<void> => {
    await query('DELETE FROM usuarios WHERE usuario_id = $1', [id]);
};

// Function to find a user by email, useful for login logic later
export const findByEmail = async (email: string): Promise<User | null> => {
  const { rows } = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return rows[0] || null;
};