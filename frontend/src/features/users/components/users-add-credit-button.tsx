import { IconCoin } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Row } from '@tanstack/react-table';
import { useUsers } from '../context/users-context';
import { User } from '../data/schema';

interface UsersAddCreditButtonProps {
  row: Row<User>;
}

export function UsersAddCreditButton({ row }: UsersAddCreditButtonProps) {
  const { setOpen, setCurrentRow } = useUsers();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        setCurrentRow(row.original);
        setOpen('add-credit');
      }}
      className="flex items-center gap-1"
    >
      <IconCoin size={16} />
      <span className="hidden md:inline">Crédito</span>
    </Button>
  );
}
