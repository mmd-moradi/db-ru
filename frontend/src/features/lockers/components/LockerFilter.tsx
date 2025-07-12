import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRestaurants } from "../api/lockers-api";

const filterSchema = z.object({
  restaurante_id: z.string().optional(),
  status: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

interface LockerFilterProps {
  onFilterChange: (filter: { restaurante_id?: number, status?: string }) => void;
}

export function LockerFilter({ onFilterChange }: LockerFilterProps) {
  const { data: restaurants = [], isLoading } = useRestaurants();

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {},
  });

  function onSubmit(data: FilterValues) {
    onFilterChange({
      restaurante_id: data.restaurante_id ? parseInt(data.restaurante_id, 10) : undefined,
      status: data.status || undefined,
    });
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtrar Armários</CardTitle>
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
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os restaurantes" />
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Disponivel">Disponível</SelectItem>
                        <SelectItem value="Ocupado">Ocupado</SelectItem>
                        <SelectItem value="Manutencao">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  Filtrar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
