import { z } from 'zod'

const menuItemSchema = z.object({
  item_id: z.number(),
  categoria_id: z.number(),
  nome_item: z.string(),
  descricao: z.string().nullable(),
  alergenicos: z.string().nullable(),
  nome_categoria: z.string()
})

const menuSchema = z.object({
  cardapio_id: z.number(),
  restaurante_id: z.number(),
  data_cardapio: z.string().transform(str => new Date(str)),
  tipo_refeicao: z.string(),
  items: z.array(menuItemSchema)
})

export type MenuItem = z.infer<typeof menuItemSchema>
export type Menu = z.infer<typeof menuSchema>