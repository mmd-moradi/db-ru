// Types for transaction history 
export interface TransactionHistory {
  usuario_id: number;
  nome_usuario: string;
  nome_grupo: string;
  transacao_id: number;
  tipo_transacao: 'Compra Ticket' | 'Credito RU' | 'Estorno';
  valor: number;
  data_hora: string; // ISO date string format
  restaurante: string | null;
}