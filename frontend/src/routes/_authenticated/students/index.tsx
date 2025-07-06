import Users from '@/features/users'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/students/')({
  component: Users,

})