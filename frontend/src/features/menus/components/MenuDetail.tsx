import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TrashIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Menu } from "../data/schema";
import { AddItemToMenuDialog } from "./AddItemToMenuDialog";
import { useDeleteMenu, useRemoveItemFromMenu } from "../api/menus-api";

interface MenuDetailProps {
  menu: Menu;
}

export function MenuDetail({ menu }: MenuDetailProps) {
  const deleteMenu = useDeleteMenu();
  const removeItem = useRemoveItemFromMenu();

  // Group items by category
  const itemsByCategory = menu.items.reduce((acc, item) => {
    if (!acc[item.nome_categoria]) {
      acc[item.nome_categoria] = [];
    }
    acc[item.nome_categoria].push(item);
    return acc;
  }, {} as Record<string, typeof menu.items>);

  // Categories in sorted order
  const categories = Object.keys(itemsByCategory).sort();

  // Format date for display
  const formattedDate = format(new Date(menu.data_cardapio), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {menu.tipo_refeicao === "Cafe da Manha" ? "Café da Manhã" : menu.tipo_refeicao} - {formattedDate}
            </CardTitle>
            <CardDescription>
              Cardápio #{menu.cardapio_id}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <AddItemToMenuDialog menu={menu} />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Remover Cardápio
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá remover permanentemente o cardápio e todos os seus itens associados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteMenu.mutate(menu.cardapio_id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteMenu.isPending ? "Removendo..." : "Remover"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Nenhum item adicionado a este cardápio.
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <h3 className="text-lg font-semibold">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {itemsByCategory[category].map((item) => (
                    <div
                      key={item.item_id}
                      className="p-3 border rounded-md flex justify-between items-start"
                    >
                      <div>
                        <div className="font-medium">{item.nome_item}</div>
                        {item.descricao && (
                          <p className="text-sm text-muted-foreground">{item.descricao}</p>
                        )}
                        {item.alergenicos && (
                          <Badge variant="outline" className="mt-1">Alérgicos: {item.alergenicos}</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeItem.mutate({
                            cardapio_id: menu.cardapio_id,
                            item_id: item.item_id,
                          })
                        }
                      >
                        <Cross2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
