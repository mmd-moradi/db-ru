import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: () => <HomePage />,
})


export const HomePage = () => {
  return (
    <div className='w-full flex items-center justify-center h-full'>
      <div className='w-full p-4 flex items-center justify-center flex-col'>
        <h1 className='text-2xl font-bold mb-4'>Bem-vindo ao Dashboard 👋</h1>
      </div>
    </div>
  )
}