import {
  IconHelp,
  IconLayoutDashboard,
  IconUsers,
} from '@tabler/icons-react'
import { BadgeDollarSign, Beef, Command, Contact, HandPlatter, Utensils, Vault, Wheat } from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin-ru@unb.br',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'BD-RU',
      logo: Command,
      plan: 'Dashboard De Admin',
    },
  ],
  navGroups: [
    {
      title: 'Geral',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Usuários',
          url: '/users',
          icon: IconUsers
        },
        {
          title: 'Funcionários',
          url: '/employees',
          icon: Contact,
        },
        {
          title: 'Restaurantes',
          url: '/restaurants',
          icon: Utensils,
        },
        {
          title: "Guarda Volumes",
          url: '/lockers',
          icon: Vault,
        }
      ],
    },
    {
      title: "Serviços",
      items: [
        {
          title: 'Cardapios',
          icon: HandPlatter,
          url: '/menus',
        },
        {
          title: 'Itens',
          icon: Beef,
          url: '/items',
        },
        {
          title: "Categorias",
          icon: Wheat,
          url: '/categories',
        }
      ],
    },
    {
      title: 'Pagamentos',
      items: [
        {
          title: 'Transações',
          icon: BadgeDollarSign,
          url: '/transactions'
        },
        {
          title: 'Ajudas',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
