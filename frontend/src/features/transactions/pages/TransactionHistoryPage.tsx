import { useState } from 'react';
import { useTransactionHistory } from '../api/transactions-api';
import { TransactionHistory } from '../data/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/format';

export function TransactionHistoryPage() {
  const [userId, setUserId] = useState<string>('');
  const [searchedUserId, setSearchedUserId] = useState<number | undefined>(undefined);

  const { data: transactions, isLoading, error, isError } = useTransactionHistory(searchedUserId);

  const handleSearch = () => {
    const parsedUserId = parseInt(userId);
    if (!isNaN(parsedUserId)) {
      setSearchedUserId(parsedUserId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getTransactionTypeClass = (type: TransactionHistory['tipo_transacao']) => {
    switch (type) {
      case 'Compra Ticket':
        return 'text-red-500';
      case 'Credito RU':
        return 'text-green-500';
      case 'Estorno':
        return 'text-blue-500';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Input
              type="number"
              placeholder="ID do Usuário"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-w-xs"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2Icon className="h-4 w-4 mr-2 animate-spin" /> : <SearchIcon className="h-4 w-4 mr-2" />}
              Buscar
            </Button>
          </div>

          {isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Erro ao buscar transações do usuário.'}
              </AlertDescription>
            </Alert>
          )}

          {searchedUserId !== undefined && !isLoading && !isError && transactions?.length === 0 && (
            <Alert className="mb-6">
              <AlertTitle>Nenhuma transação encontrada</AlertTitle>
              <AlertDescription>
                Não existem transações registradas para o usuário {searchedUserId}.
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2Icon className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Transação</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Restaurante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.transacao_id}>
                      <TableCell>{transaction.transacao_id}</TableCell>
                      <TableCell>{transaction.nome_usuario}</TableCell>
                      <TableCell>{transaction.nome_grupo}</TableCell>
                      <TableCell className={getTransactionTypeClass(transaction.tipo_transacao)}>
                        {transaction.tipo_transacao}
                      </TableCell>
                      <TableCell className={transaction.tipo_transacao === 'Compra Ticket' ? 'text-red-500' : 'text-green-500'}>
                        {formatCurrency(transaction.valor)}
                      </TableCell>
                      <TableCell>{format(new Date(transaction.data_hora), 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell>{transaction.restaurante || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
