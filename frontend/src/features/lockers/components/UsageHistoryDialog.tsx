import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClockIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Locker } from "../data/schema";
import { useLockerUsageHistory } from "../api/lockers-api";

interface UsageHistoryDialogProps {
  locker: Locker;
}

export function UsageHistoryDialog({ locker }: UsageHistoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: usageHistory = [], isLoading } = useLockerUsageHistory({ 
    armario_id: open ? locker.armario_id : undefined 
  });
  
  function formatDateTime(date: Date | null) {
    if (!date) return "—";
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <ClockIcon className="mr-2 h-4 w-4" />
          Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Histórico de Uso - Armário {locker.numero_armario}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Carregando histórico...</p>
            </div>
          ) : usageHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum histórico de uso encontrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário ID</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageHistory.map((usage) => (
                  <TableRow key={usage.uso_id}>
                    <TableCell className="font-medium">{usage.uso_id}</TableCell>
                    <TableCell>{usage.usuario_id}</TableCell>
                    <TableCell>{formatDateTime(usage.data_hora_checkin)}</TableCell>
                    <TableCell>{formatDateTime(usage.data_hora_checkout)}</TableCell>
                    <TableCell>
                      {usage.data_hora_checkout ? (
                        <span className="text-green-600">Finalizado</span>
                      ) : (
                        <span className="text-yellow-600">Em uso</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
