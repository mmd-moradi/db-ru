import { IconTicket } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Row } from '@tanstack/react-table';
import { useUsers } from '../context/users-context';
import { User } from '../data/schema';

interface UsersBuyTicketButtonProps {
  row: Row<User>;
}

export function UsersBuyTicketButton({ row }: UsersBuyTicketButtonProps) {
  const { setOpen, setCurrentRow } = useUsers();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        setCurrentRow(row.original);
        setOpen('buy-ticket');
      }}
      className="flex items-center gap-1"
    >
      <IconTicket size={16} />
      <span className="hidden md:inline">Ticket</span>
    </Button>
  );
}
