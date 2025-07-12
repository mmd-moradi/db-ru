import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExitIcon } from "@radix-ui/react-icons";
import { useCheckOutLocker } from "../api/lockers-api";
import { Locker } from "../data/schema";

interface CheckOutDialogProps {
  locker: Locker;
}

export function CheckOutDialog({ locker }: CheckOutDialogProps) {
  const checkOutMutation = useCheckOutLocker();
  const [open, setOpen] = useState(false);

  // Only allow check-out if the locker is occupied
  const isOccupied = locker.status === "Ocupado";

  function handleCheckOut() {
    checkOutMutation.mutate(locker.armario_id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
          disabled={!isOccupied}
        >
          <ExitIcon className="mr-2 h-4 w-4" />
          Check-out
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Check-out de Armário</DialogTitle>
          <DialogDescription>
            Deseja confirmar o check-out do armário {locker.numero_armario}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="default"
            className="bg-amber-600 hover:bg-amber-700"
            onClick={handleCheckOut}
            disabled={checkOutMutation.isPending}
          >
            {checkOutMutation.isPending ? "Processando..." : "Confirmar Check-out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
