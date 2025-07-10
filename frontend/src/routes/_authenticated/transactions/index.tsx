import { createFileRoute } from '@tanstack/react-router'
import { TransactionHistoryPage } from '@/features/transactions'

export const Route = createFileRoute('/_authenticated/transactions/')({
  component: TransactionHistoryPage,
})
