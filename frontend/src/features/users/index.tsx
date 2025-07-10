import { Main } from '@/components/layout/main'
import { UsersDialogs } from './components/users-dialogs'
import UsersProvider from './context/users-context'
import { useUsersData } from './api/users-api'
import { columns } from './components/users-columns';
import { UsersTable } from './components/users-table';
import { UsersPrimaryButtons } from './components/users-primary-buttons';
export default function Users() {
  // Parse user list

  const users = useUsersData();
  if (users.isLoading || users.isFetching || users.data === undefined) {
    return <div>Loading...</div>
  }

  return (
    <UsersProvider>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>lista de usuários</h2>
            <p className='text-muted-foreground'>
              Gerencie seus usuários.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <UsersTable data={users.data} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
