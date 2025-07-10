import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useBuyTicket } from '@/features/transactions/api/transactions-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '../data/schema';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoaderIcon } from 'lucide-react';

// Schema for the form
const formSchema = z.object({
  tipo_ticket_id: z.string().min(1, { message: 'Selecione um tipo de ticket' }),
  restaurante_id: z.string().min(1, { message: 'Selecione um restaurante' }),
});

interface TicketType {
  tipo_ticket_id: number;
  nome_tipo: string;
}

interface Restaurant {
  restaurante_id: number;
  nome_campus: string;
}

interface UsersBuyTicketDialogProps {
  open: boolean;
  onOpenChange: () => void;
  currentUser: User | null;
}

export function UsersBuyTicketDialog({
  open,
  onOpenChange,
  currentUser,
}: UsersBuyTicketDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: buyTicket, isPending } = useBuyTicket();
  
  // Fetch ticket types
  const { data: ticketTypes, isLoading: loadingTicketTypes } = useQuery({
    queryKey: ['ticketTypes'],
    queryFn: async () => {
      const { data } = await api.get<TicketType[]>('/ticket-types');
      return data;
    },
  });

  // Fetch restaurants
  const { data: restaurants, isLoading: loadingRestaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data } = await api.get<Restaurant[]>('/restaurants');
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_ticket_id: '',
      restaurante_id: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!currentUser) return;
    
    buyTicket({
      usuario_id: currentUser.usuario_id,
      tipo_ticket_id: parseInt(values.tipo_ticket_id),
      restaurante_id: parseInt(values.restaurante_id),
    }, {
      onSuccess: () => {
        // Invalidate users query to refresh the data (especially the balance)
        queryClient.invalidateQueries({ queryKey: ['users'] });
        form.reset();
        onOpenChange();
      }
    });
  };

  const isLoading = loadingTicketTypes || loadingRestaurants || isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comprar Ticket</DialogTitle>
          <DialogDescription>
            {currentUser ? (
              <>Comprar um ticket para <strong>{currentUser.nome}</strong></>
            ) : (
              'Selecione um tipo de ticket e restaurante para realizar a compra'
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo_ticket_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ticket</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de ticket" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ticketTypes?.map(type => (
                        <SelectItem key={type.tipo_ticket_id} value={type.tipo_ticket_id.toString()}>
                          {type.nome_tipo}
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
              name="restaurante_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurante</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o restaurante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {restaurants?.map(restaurant => (
                        <SelectItem key={restaurant.restaurante_id} value={restaurant.restaurante_id.toString()}>
                          {restaurant.nome_campus}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
                Comprar Ticket
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
