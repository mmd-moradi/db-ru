import { MenusPage } from '@/features/menus'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/menus/')({
  component: MenusPage,
})

