// import { useState } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { useAddCredit } from '@/features/transactions/api/transactions-api';
// import { useQueryClient } from '@tanstack/react-query';
// import { User } from '../data/schema';

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Button } from '@/components/ui/button';
// import { LoaderIcon } from 'lucide-react';
// import { Input } from '@/components/ui/input';

// // Schema for the form
// const formSchema = z.object({
//   valor: z.string().min(1, { message: 'Informe o valor' }).transform(val => {
//     // Convert string to number, handling both comma and dot as decimal separators
//     const parsedValue = parseFloat(val.replace(',', '.'));
//     return isNaN(parsedValue) ? 0 : parsedValue;
//   }).refine(val => val > 0, { 
//     message: 'O valor deve ser maior que zero'
//   })
// });

// interface UsersAddCreditDialogProps {
//   open: boolean;
//   onOpenChange: () => void;
//   currentUser: User | null;
// }

// export function UsersAddCreditDialog({
//   open,
//   onOpenChange,
//   currentUser,
// }: UsersAddCreditDialogProps) {
//   const queryClient = useQueryClient();
//   const { mutate: addCredit, isPending } = useAddCredit();
  
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       valor: '',
//     },
//   });

//   const onSubmit = (values: z.infer<typeof formSchema>) => {
//     if (!currentUser) return;
    
//     addCredit({
//       usuario_id: currentUser.usuario_id,
//       valor: values.valor,
//     }, {
//       onSuccess: () => {
//         // Invalidate users query to refresh the data (especially the balance)
//         queryClient.invalidateQueries({ queryKey: ['users'] });
//         form.reset();
//         onOpenChange();
//       }
//     });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Adicionar Crédito</DialogTitle>
//           <DialogDescription>
//             {currentUser ? (
//               <>Adicionar crédito para <strong>{currentUser.nome}</strong></>
//             ) : (
//               'Informe o valor a ser creditado na conta do usuário'
//             )}
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="valor"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Valor (R$)</FormLabel>
//                   <FormControl>
//                     <Input 
//                       placeholder="0,00"
//                       type="number"
//                       step="0.01"
//                       min="0.01"
//                       {...field}
//                       disabled={isPending}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <DialogFooter>
//               <Button 
//                 type="submit" 
//                 disabled={isPending}
//                 className="w-full sm:w-auto"
//               >
//                 {isPending && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
//                 Adicionar Crédito
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
