import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { z } from "zod";
import { useMenuFilterStore } from "../stores/menu-filter-store";
import { useRestaurants } from "../api/menus-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const filterSchema = z.object({
  restaurante_id: z.string().min(1, "Selecione um restaurante"),
  data_cardapio: z.date(),
  tipo_refeicao: z.enum(["Cafe da Manha", "Almoco", "Jantar"], {
    required_error: "Selecione o tipo de refeição",
  }),
});

type FilterValues = z.infer<typeof filterSchema>;

export function MenuFilter() {
  const { filter, setFilter } = useMenuFilterStore();
  const { data: restaurants = [], isLoading } = useRestaurants();
  const [date, setDate] = useState<Date | undefined>(
    filter.data_cardapio ? new Date(filter.data_cardapio) : undefined
  );

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      restaurante_id: filter.restaurante_id?.toString() || "",
      tipo_refeicao: (filter.tipo_refeicao as "Cafe da Manha" | "Almoco" | "Jantar") || undefined,
    },
  });

  function onSubmit(data: FilterValues) {
    const formattedDate = format(data.data_cardapio, "yyyy-MM-dd");
    
    setFilter({
      restaurante_id: parseInt(data.restaurante_id, 10),
      data_cardapio: formattedDate,
      tipo_refeicao: data.tipo_refeicao,
    });
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtrar Cardápios</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Buscar Cardápio
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
