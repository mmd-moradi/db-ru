import api from "@/lib/api";
import { Menu, MenuItem } from "../data/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Restaurant } from "../types";

// Fetch a menu by restaurant, date, and meal type
const getMenuByDate = async (restaurante_id: number, data_cardapio: string, tipo_refeicao: string): Promise<Menu> => {
  const { data } = await api.get<Menu>(
    `/menus/find?restaurante_id=${restaurante_id}&data=${data_cardapio}&tipo=${tipo_refeicao}`
  );
  return data;
};

// Fetch all restaurants
const getRestaurants = async (): Promise<Restaurant[]> => {
  const { data } = await api.get<Restaurant[]>('/restaurants');
  return data;
};

// Fetch all menu items
const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data } = await api.get<MenuItem[]>('/menu-items');
  return data;
};

// Create a new menu shell
const createMenu = async (menu: Omit<Menu, "cardapio_id" | "items">): Promise<Menu> => {
  const { data } = await api.post<Menu>("/menus", menu);
  return data;
};

// Add an item to a menu
const addItemToMenu = async ({ cardapio_id, item_id }: { cardapio_id: number; item_id: number }): Promise<void> => {
  await api.post(`/menus/${cardapio_id}/items`, { item_id });
};

// Remove an item from a menu
const removeItemFromMenu = async ({ cardapio_id, item_id }: { cardapio_id: number; item_id: number }): Promise<void> => {
  await api.delete(`/menus/${cardapio_id}/items/${item_id}`);
};

// Delete a menu
const deleteMenu = async (cardapio_id: number): Promise<void> => {
  await api.delete(`/menus/${cardapio_id}`);
};

// React Query hooks
export const useMenuByDate = (restaurante_id: number | null, data_cardapio: string | null, tipo_refeicao: string | null) => {
  return useQuery({
    queryKey: ["menu", restaurante_id, data_cardapio, tipo_refeicao],
    queryFn: () => {
      if (!restaurante_id || !data_cardapio || !tipo_refeicao) {
        return null;
      }
      return getMenuByDate(restaurante_id, data_cardapio, tipo_refeicao);
    },
    enabled: !!restaurante_id && !!data_cardapio && !!tipo_refeicao,
  });
};

export const useRestaurants = () => {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMenu,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["menu", variables.restaurante_id] });
      toast.success("Cardápio criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar cardápio: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    },
  });
};

export const useAddItemToMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addItemToMenu,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["menu"],
      });
      toast.success("Item adicionado ao cardápio com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar item ao cardápio: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    },
  });
};

export const useRemoveItemFromMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeItemFromMenu,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["menu"],
      });
      toast.success("Item removido do cardápio com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao remover item do cardápio: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Cardápio removido com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao remover cardápio: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    },
  });
};
