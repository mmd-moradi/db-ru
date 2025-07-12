import { z } from 'zod'

const lockerSchema = z.object({
  armario_id: z.number(),
  restaurante_id: z.number(),
  numero_armario: z.string(),
  status: z.enum(['Disponivel', 'Ocupado', 'Manutencao'])
})

const lockerUsageSchema = z.object({
  uso_id: z.number(),
  armario_id: z.number(),
  usuario_id: z.number(),
  data_hora_checkin: z.string().transform(str => new Date(str)),
  data_hora_checkout: z.string().nullable().transform(str => str ? new Date(str) : null)
})

export type Locker = z.infer<typeof lockerSchema>
export type LockerUsage = z.infer<typeof lockerUsageSchema>