import { useState } from "react";
import { useMenuByDate } from "../api/menus-api";
import { MenuFilter } from "../components/MenuFilter";
import { MenuDetail } from "../components/MenuDetail";
import { CreateMenuDialog } from "../components/CreateMenuDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InfoIcon, Loader2Icon } from "lucide-react";
import { useMenuFilterStore } from "../stores/menu-filter-store";

export function MenusPage() {
  const { filter } = useMenuFilterStore();
  const { data: menu, isLoading, error, isError } = useMenuByDate(
    filter.restaurante_id,
    filter.data_cardapio,
    filter.tipo_refeicao
  );
  
  const [showHelp, setShowHelp] = useState(
    !filter.restaurante_id && !filter.data_cardapio && !filter.tipo_refeicao
  );

  const allFiltersSelected = filter.restaurante_id && filter.data_cardapio && filter.tipo_refeicao;
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de Cardápios</h1>
        <CreateMenuDialog />
      </div>
      
      <MenuFilter />
      
      {showHelp && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Como começar</AlertTitle>
          <AlertDescription>
            Utilize os filtros acima para buscar um cardápio existente por restaurante, data e tipo de refeição. 
            Para criar um novo cardápio, clique no botão "Novo Cardápio".
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading && allFiltersSelected && (
        <div className="flex justify-center items-center py-12">
          <Loader2Icon className="mr-2 h-6 w-6 animate-spin" />
          <span>Carregando cardápio...</span>
        </div>
      )}
      
      {isError && allFiltersSelected && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Erro ao carregar o cardápio. Tente novamente.'}
          </AlertDescription>
        </Alert>
      )}
      
      {!isLoading && !menu && allFiltersSelected && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Nenhum cardápio encontrado</AlertTitle>
          <AlertDescription>
            Não foi encontrado um cardápio para os filtros selecionados. Você pode criar um novo cardápio clicando no botão "Novo Cardápio".
          </AlertDescription>
        </Alert>
      )}
      
      {menu && <MenuDetail menu={menu} />}
    </div>
  );
}
