import { create } from 'zustand'

interface RestaurantFilter {
  restaurante_id: number | null
  data_cardapio: string | null
  tipo_refeicao: string | null
}

interface MenuFilterStore {
  filter: RestaurantFilter
  setFilter: (filter: Partial<RestaurantFilter>) => void
  resetFilter: () => void
}

export const useMenuFilterStore = create<MenuFilterStore>((set) => ({
  filter: {
    restaurante_id: null,
    data_cardapio: null,
    tipo_refeicao: null,
  },
  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),
  resetFilter: () =>
    set({
      filter: {
        restaurante_id: null,
        data_cardapio: null,
        tipo_refeicao: null,
      },
    }),
}))
