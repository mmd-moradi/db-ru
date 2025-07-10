import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnterIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useCheckInLocker } from "../api/lockers-api";
import { Locker } from "../data/schema";

const checkInSchema = z.object({
  usuario_id: z.string(),
});

type CheckInValues = z.infer<typeof checkInSchema>;

interface CheckInDialogProps {
  locker: Locker;
}

export function CheckInDialog({ locker }: CheckInDialogProps) {
  const checkInMutation = useCheckInLocker();
  const [open, setOpen] = useState(false);

  const form = useForm<CheckInValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {},
  });

  // Only allow check-in if the locker is available
  const isAvailable = locker.status === "Disponivel";

  function onSubmit(data: CheckInValues) {
    checkInMutation.mutate(
      {
        armario_id: locker.armario_id,
        usuario_id: parseInt(data.usuario_id, 10),
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
          disabled={!isAvailable}
        >
          <EnterIcon className="mr-2 h-4 w-4" />
          Check-in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Check-in de Armário</DialogTitle>
          <DialogDescription>
            Informe o ID do usuário para realizar o check-in no armário {locker.numero_armario}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="usuario_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Usuário</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Digite o ID do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                disabled={checkInMutation.isPending}
              >
                {checkInMutation.isPending ? "Processando..." : "Confirmar Check-in"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
