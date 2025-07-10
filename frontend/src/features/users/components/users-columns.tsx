import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { User } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UsersBuyTicketButton } from './users-buy-ticket-button'

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'foto_perfil',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Foto' />
    ),
    cell: ({ row }) => (
      <Avatar className='w-10 h-10'>
        <AvatarImage src={row.getValue('foto_perfil')} />
        <AvatarFallback>
         CN
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: 'matricula',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Matricula' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('matricula')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableHiding: false,
  },
  {
    id: 'nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nome' />
    ),
    cell: ({ row }) => {
      const { nome} = row.original
      const fullName = `${nome}`
      return <LongText className='max-w-36'>{fullName}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'saldo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Saldo' />
    ),
    cell: ({ row }) => {
      const saldo = parseFloat(row.getValue('saldo'));
      // Format as Brazilian currency
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(saldo);
      return <div>{formatted}</div>;
    },
    enableSorting: false,
  },
  {
    id: 'buy_ticket',
    header: () => <div className="text-right">Comprar</div>,
    cell: ({ row }) => <UsersBuyTicketButton row={row} />,
    meta: { className: 'justify-center lg:justify-end' },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
