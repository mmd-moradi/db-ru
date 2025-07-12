import { string, z } from 'zod'

const userSchema = z.object({
  usuario_id: z.number(),
  grupo_id: z.number(),
  nome: z.string(),
  matricula: z.string(),
  email: z.string(),
  senha_hash: z.string(),
  saldo: z.number(),
  foto_perfil: string().optional(),
  data_criacao: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>


const CreateSchema = z.object({
  grupo_id: z.number(),
  nome: z.string(),
  matricula: z.string(),
  email: z.string(),
  senha_plaintext: z.string(),
  saldo: z.number(),
  foto_perfil: z.string().optional()
})

export type UserCreateData = z.infer<typeof CreateSchema>

export const userListSchema = z.array(userSchema)
