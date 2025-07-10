import { useState } from "react";
import { useLockers, useRestaurants } from "../api/lockers-api";
import { LockerFilter } from "../components/LockerFilter";
import { LockerList } from "../components/LockerList";
import { CreateLockerDialog } from "../components/CreateLockerDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function LockersPage() {
  const [filters, setFilters] = useState<{ restaurante_id?: number, status?: string }>({});
  const { data: lockers = [], isLoading } = useLockers(filters);
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useRestaurants();
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de Armários</h1>
        <CreateLockerDialog />
      </div>
      
      <LockerFilter onFilterChange={setFilters} />
      
      {!isLoading && lockers.length === 0 && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Nenhum armário encontrado</AlertTitle>
          <AlertDescription>
            Não há armários cadastrados com os filtros selecionados. Você pode criar um novo armário clicando no botão "Novo Armário".
          </AlertDescription>
        </Alert>
      )}
      
      <LockerList 
        lockers={lockers} 
        restaurants={restaurants} 
        isLoading={isLoading || isLoadingRestaurants} 
      />
    </div>
  );
}
