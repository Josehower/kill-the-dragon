import { Dispatch, SetStateAction } from 'react';
import { PlayerInventory } from '../components/GameObject';
import { CombatAction } from '../database/actions';

export function getUseItemFunc(id: number, action: CombatAction) {
  const itemId = id;
  const itemAction = action;
  return (
    playerInventory: [
      PlayerInventory,
      Dispatch<SetStateAction<PlayerInventory>>,
    ],
  ) => {
    const [inventory, setInventory] = playerInventory;
    const itemInInventory = inventory.items.find(
      (inventoryObj) => inventoryObj.item.id === itemId && inventoryObj.qty > 0,
    );
    if (!itemInInventory) {
      return null;
    }
    itemInInventory.qty += -1;
    const lastPotion = itemInInventory.qty < 1;
    const newItemArray = lastPotion
      ? inventory.items.filter(({ item }) => item.id !== itemId)
      : inventory.items.map(({ item, qty }) => {
          if (item.id === itemId) {
            return { ...itemInInventory };
          } else {
            return { item, qty };
          }
        });

    setInventory({ ...inventory, items: newItemArray });
    return itemAction;
  };
}
