import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon } from "@radix-ui/react-icons";
import { Menu, MenuItem } from "../data/schema";
import { useAddItemToMenu, useMenuItems } from "../api/menus-api";

interface AddItemToMenuDialogProps {
  menu: Menu;
}

export function AddItemToMenuDialog({ menu }: AddItemToMenuDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const { data: menuItems = [], isLoading } = useMenuItems();
  const addItemMutation = useAddItemToMenu();

  // Filter out items that are already in the menu
  const availableItems = menuItems.filter(
    (item) => !menu.items.some((menuItem) => menuItem.item_id === item.item_id)
  );

  const handleAddItem = () => {
    if (selectedItemId) {
      addItemMutation.mutate(
        {
          cardapio_id: menu.cardapio_id,
          item_id: parseInt(selectedItemId, 10),
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelectedItemId("");
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Adicionar Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Item ao Cardápio</DialogTitle>
          <DialogDescription>
            Selecione um item para adicionar ao cardápio.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select
            disabled={isLoading || availableItems.length === 0}
            onValueChange={setSelectedItemId}
            value={selectedItemId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                availableItems.length === 0
                  ? "Não há itens disponíveis para adicionar"
                  : "Selecione um item"
              } />
            </SelectTrigger>
            <SelectContent>
              {availableItems.map((item) => (
                <SelectItem key={item.item_id} value={item.item_id.toString()}>
                  {item.nome_item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddItem} 
            disabled={!selectedItemId || addItemMutation.isPending}
          >
            {addItemMutation.isPending ? "Adicionando..." : "Adicionar Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
