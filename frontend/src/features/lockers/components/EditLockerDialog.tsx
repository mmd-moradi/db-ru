import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useUpdateLocker, useRestaurants } from "../api/lockers-api";
import { Locker } from "../data/schema";

const updateLockerSchema = z.object({
  restaurante_id: z.string().min(1, "Selecione um restaurante"),
  numero_armario: z.string().min(1, "Número do armário é obrigatório"),
  status: z.enum(["Disponivel", "Ocupado", "Manutencao"], {
    required_error: "Status é obrigatório",
  }),
});

type UpdateLockerValues = z.infer<typeof updateLockerSchema>;

interface EditLockerDialogProps {
  locker: Locker;
}

export function EditLockerDialog({ locker }: EditLockerDialogProps) {
  const { data: restaurants = [], isLoading } = useRestaurants();
  const updateLockerMutation = useUpdateLocker();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateLockerValues>({
    resolver: zodResolver(updateLockerSchema),
    defaultValues: {
      restaurante_id: locker.restaurante_id.toString(),
      numero_armario: locker.numero_armario,
      status: locker.status,
    },
  });

  // Update form values when locker changes
  useEffect(() => {
    form.reset({
      restaurante_id: locker.restaurante_id.toString(),
      numero_armario: locker.numero_armario,
      status: locker.status,
    });
  }, [form, locker]);

  function onSubmit(data: UpdateLockerValues) {
    updateLockerMutation.mutate(
      {
        id: locker.armario_id,
        locker: {
          restaurante_id: parseInt(data.restaurante_id, 10),
          numero_armario: data.numero_armario,
          status: data.status,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Armário</DialogTitle>
          <DialogDescription>
            Atualize as informações do armário.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="restaurante_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurante</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um restaurante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {restaurants.map((restaurant) => (
                        <SelectItem
                          key={restaurant.restaurante_id}
                          value={restaurant.restaurante_id.toString()}
                        >
                          {restaurant.nome_campus}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numero_armario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Armário</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Disponivel">Disponível</SelectItem>
                      <SelectItem value="Ocupado">Ocupado</SelectItem>
                      <SelectItem value="Manutencao">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateLockerMutation.isPending}>
                {updateLockerMutation.isPending ? "Atualizando..." : "Atualizar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
