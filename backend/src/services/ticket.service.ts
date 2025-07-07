import pool from '../db';

export const create = async (
  usuarioId: number,
  restauranteId: number,
  categoriaTicketId: number,
  preco: number
) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // SELECT usa o nome correto da coluna
    const saldoRes = await client.query(
      'SELECT saldoatual FROM usuario WHERE usuarioid = $1 FOR UPDATE',
      [usuarioId]
    );
    if (!saldoRes.rowCount) throw new Error('usuario_nao_existe');

    const saldo = saldoRes.rows[0].saldoatual as number;
    if (saldo < preco) throw new Error('saldo_insuficiente');

    await client.query(
      'UPDATE usuario SET saldoatual = saldoatual - $1 WHERE usuarioid = $2',
      [preco, usuarioId]
    );

    const trx = (
      await client.query(
        `INSERT INTO transacao (valor,datahora,tipotransacao,usuarioid,restauranteid)
         VALUES ($1,NOW(),'COMPRA',$2,$3) RETURNING transacaoid`,
        [preco, usuarioId, restauranteId]
      )
    ).rows[0];

    const tk = (
      await client.query(
        `INSERT INTO ticket (datacompra,status,transacaoid,categoriaticketid)
         VALUES (NOW(),'ATIVO',$1,$2) RETURNING *`,
        [trx.transacaoid, categoriaTicketId]
      )
    ).rows[0];

    await client.query('COMMIT');
    return tk;
  } catch (e: any) {
    await client.query('ROLLBACK');
    if (e.message === 'saldo_insuficiente') throw { code: 'SALDO' };
    throw e;
  } finally {
    client.release();
  }
};
