import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { z } from "zod";
import { useCreateMenu, useRestaurants } from "../api/menus-api";

const createMenuSchema = z.object({
  restaurante_id: z.string().min(1, "Selecione um restaurante"),
  data_cardapio: z.date(),
  tipo_refeicao: z.enum(["Cafe da Manha", "Almoco", "Jantar"], {
    required_error: "Selecione o tipo de refeição",
  }),
});

type CreateMenuValues = z.infer<typeof createMenuSchema>;

export function CreateMenuDialog() {
  const { data: restaurants = [], isLoading } = useRestaurants();
  const createMenu = useCreateMenu();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  const form = useForm<CreateMenuValues>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {},
  });

  function onSubmit(data: CreateMenuValues) {
    createMenu.mutate(
      {
        restaurante_id: parseInt(data.restaurante_id, 10),
        data_cardapio: data.data_cardapio,
        tipo_refeicao: data.tipo_refeicao,
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
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Cardápio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Cardápio</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar um novo cardápio.
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
                    defaultValue={field.value}
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
              name="data_cardapio"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal"
                        >
                          {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date);
                          field.onChange(date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_refeicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refeição</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de refeição" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cafe da Manha">Café da Manhã</SelectItem>
                      <SelectItem value="Almoco">Almoço</SelectItem>
                      <SelectItem value="Jantar">Jantar</SelectItem>
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
              <Button type="submit" disabled={createMenu.isPending}>
                {createMenu.isPending ? "Criando..." : "Criar Cardápio"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
