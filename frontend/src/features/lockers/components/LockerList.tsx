import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TrashIcon } from "@radix-ui/react-icons";
import { Locker } from "../data/schema";
import { EditLockerDialog } from "./EditLockerDialog";
import { CheckInDialog } from "./CheckInDialog";
import { CheckOutDialog } from "./CheckOutDialog";
import { UsageHistoryDialog } from "./UsageHistoryDialog";
import { useDeleteLocker } from "../api/lockers-api";

interface LockerListProps {
  lockers: Locker[];
  restaurants: { restaurante_id: number; nome_campus: string }[];
  isLoading: boolean;
}

export function LockerList({ lockers, restaurants, isLoading }: LockerListProps) {
  const deleteLocker = useDeleteLocker();

  // Function to get restaurant name by id
  const getRestaurantName = (id: number) => {
    const restaurant = restaurants.find((r) => r.restaurante_id === id);
    return restaurant ? restaurant.nome_campus : "Desconhecido";
  };

  // Function to get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Disponivel":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Disponível</Badge>;
      case "Ocupado":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Ocupado</Badge>;
      case "Manutencao":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Manutenção</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p>Carregando armários...</p>
      </div>
    );
  }

  if (lockers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum armário encontrado.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Restaurante</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lockers.map((locker) => (
          <TableRow key={locker.armario_id}>
            <TableCell className="font-medium">{locker.numero_armario}</TableCell>
            <TableCell>{getRestaurantName(locker.restaurante_id)}</TableCell>
            <TableCell>{getStatusBadge(locker.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <CheckInDialog locker={locker} />
                <CheckOutDialog locker={locker} />
                <UsageHistoryDialog locker={locker} />
                <EditLockerDialog locker={locker} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso irá remover permanentemente o armário {locker.numero_armario}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteLocker.mutate(locker.armario_id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        {deleteLocker.isPending ? "Removendo..." : "Remover"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
