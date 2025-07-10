import { createFileRoute } from '@tanstack/react-router'
import { LockersPage } from '@/features/lockers'

export const Route = createFileRoute('/_authenticated/lockers/')({
  component: LockersPage,
})
