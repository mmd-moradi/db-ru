import api from "@/lib/api";
import { Locker, LockerUsage } from "../data/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Restaurant } from "../../menus/types";

// Fetch all lockers with optional filters
const getLockers = async (filters?: { restaurante_id?: number, status?: string }): Promise<Locker[]> => {
  const queryParams = new URLSearchParams();
  if (filters?.restaurante_id) {
    queryParams.append('restaurante_id', filters.restaurante_id.toString());
  }
  if (filters?.status) {
    queryParams.append('status', filters.status);
  }
  
  const queryString = queryParams.toString();
  const url = `/lockers${queryString ? `?${queryString}` : ''}`;
  
  const { data } = await api.get<Locker[]>(url);
  return data;
};

// Fetch locker by ID
const getLockerById = async (id: number): Promise<Locker> => {
  const { data } = await api.get<Locker>(`/lockers/${id}`);
  return data;
};

// Create a new locker
const createLocker = async (locker: Omit<Locker, "armario_id">): Promise<Locker> => {
  const { data } = await api.post<Locker>("/lockers", locker);
  return data;
};

// Update an existing locker
const updateLocker = async ({ id, locker }: { id: number, locker: Partial<Omit<Locker, "armario_id">> }): Promise<Locker> => {
  const { data } = await api.put<Locker>(`/lockers/${id}`, locker);
  return data;
};

// Delete a locker
const deleteLocker = async (id: number): Promise<void> => {
  await api.delete(`/lockers/${id}`);
};

// Locker usage operations
const checkInLocker = async ({ armario_id, usuario_id }: { armario_id: number, usuario_id: number }): Promise<LockerUsage> => {
  const { data } = await api.post<{ message: string, data: LockerUsage }>('/locker-usage/check-in', { armario_id, usuario_id });
  return data.data;
};

const checkOutLocker = async (armario_id: number): Promise<LockerUsage> => {
  const { data } = await api.post<{ message: string, data: LockerUsage }>('/locker-usage/check-out', { armario_id });
  return data.data;
};

const getLockerUsageHistory = async (filters?: { usuario_id?: number, armario_id?: number }): Promise<LockerUsage[]> => {
  const queryParams = new URLSearchParams();
  if (filters?.usuario_id) {
    queryParams.append('usuario_id', filters.usuario_id.toString());
  }
  if (filters?.armario_id) {
    queryParams.append('armario_id', filters.armario_id.toString());
  }
  
  const queryString = queryParams.toString();
  const url = `/locker-usage/history${queryString ? `?${queryString}` : ''}`;
  
  const { data } = await api.get<LockerUsage[]>(url);
  return data;
};

// Fetch all restaurants (for locker assignment)
const getRestaurants = async (): Promise<Restaurant[]> => {
  const { data } = await api.get<Restaurant[]>('/restaurants');
  return data;
};

// React Query hooks
export const useLockers = (filters?: { restaurante_id?: number, status?: string }) => {
  return useQuery({
    queryKey: ["lockers", filters],
    queryFn: () => getLockers(filters),
  });
};

export const useLockerById = (id: number) => {
  return useQuery({
    queryKey: ["locker", id],
    queryFn: () => getLockerById(id),
    enabled: !!id,
  });
};

export const useCreateLocker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lockers"] });
      toast.success("Armário criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar armário: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    },
  });
};

export const useUpdateLocker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lockers"] });
      toast.success("Armário atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar armário: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    },
  });
};

export const useDeleteLocker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lockers"] });
      toast.success("Armário removido com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao remover armário: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    },
  });
};

export const useCheckInLocker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkInLocker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lockers"] });
      toast.success("Check-in realizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao realizar check-in: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    },
  });
};

export const useCheckOutLocker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkOutLocker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lockers"] });
      toast.success("Check-out realizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao realizar check-out: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    },
  });
};

export const useLockerUsageHistory = (filters?: { usuario_id?: number, armario_id?: number }) => {
  return useQuery({
    queryKey: ["lockerUsage", filters],
    queryFn: () => getLockerUsageHistory(filters),
  });
};

export const useRestaurants = () => {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
};