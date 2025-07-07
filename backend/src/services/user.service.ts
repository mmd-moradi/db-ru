import { query } from '../db';

export interface User {
  usuarioid: number;
  nome: string;
  matricula: string;
  grupousuario: string;
  saldoatual: number;
}

export const findAll = async (): Promise<User[]> =>
  (await query('SELECT * FROM usuario ORDER BY usuarioid')).rows;

export const findById = async (id: number): Promise<User | null> =>
  (await query('SELECT * FROM usuario WHERE usuarioid = $1', [id])).rows[0] || null;

export const create = async (u: Partial<User>): Promise<User> =>
  (await query(
    `INSERT INTO usuario (nome, matricula, grupousuario, saldoatual, senhahash)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [u.nome, u.matricula, u.grupousuario, u.saldoatual ?? 0, 'hash']
  )).rows[0];

export const update = async (id: number, u: Partial<User>): Promise<User | null> =>
  (await query(
    `UPDATE usuario
       SET nome = COALESCE($1,nome),
           matricula = COALESCE($2,matricula),
           grupousuario = COALESCE($3,grupousuario),
           saldoatual = COALESCE($4,saldoatual)
     WHERE usuarioid = $5 RETURNING *`,
    [u.nome, u.matricula, u.grupousuario, u.saldoatual, id]
  )).rows[0] ?? null;

export const remove = (id: number) =>
  query('DELETE FROM usuario WHERE usuarioid = $1', [id]);
