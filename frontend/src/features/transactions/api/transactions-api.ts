import api from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { TransactionHistory } from "../data/schema";

// Fetch transaction history for a specific user
const getTransactionHistory = async (userId: number): Promise<TransactionHistory[]> => {
  const { data } = await api.get<TransactionHistory[]>(`/transactions/history/${userId}`);
  return data;
};

// Buy a ticket
const buyTicket = async (payload: { 
  usuario_id: number, 
  tipo_ticket_id: number, 
  restaurante_id: number 
}): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>('/transactions/buy-ticket', payload);
  return data;
};

// Add credit to user's account
const addCredit = async (payload: { 
  usuario_id: number, 
  valor: number 
}): Promise<{ message: string, new_balance: number }> => {
  const { data } = await api.post<{ message: string, new_balance: number }>('/transactions/add-credit', payload);
  return data;
};

// React Query hooks
export const useTransactionHistory = (userId: number | undefined) => {
  return useQuery({
    queryKey: ["transactionHistory", userId],
    queryFn: () => getTransactionHistory(userId as number),
    enabled: !!userId, // Only run query if userId is provided
  });
};

export const useBuyTicket = () => {
  return useMutation({
    mutationFn: buyTicket,
    onSuccess: () => {
      toast.success("Ticket comprado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao comprar ticket");
    }
  });
};

export const useAddCredit = () => {
  return useMutation({
    mutationFn: addCredit,
    onSuccess: (data) => {
      toast.success(`Crédito adicionado com sucesso! Novo saldo: ${data.new_balance}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao adicionar crédito");
    }
  });
};