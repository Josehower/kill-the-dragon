import { Dispatch, SetStateAction } from 'react';
import { GameItem } from '../database/inventory';
import { Ally } from '../database/party';
import { PlayerInventory } from '../pages/_app';
import { performOutCombatAllyAction } from './outCombat';

export function useItemOutOfCombat(
  gameItem: GameItem,
  ally: Ally,
  partySetter: Dispatch<SetStateAction<Ally[]>>,
  inventory: [PlayerInventory, Dispatch<SetStateAction<PlayerInventory>>]
) {
  const action = gameItem.useItem(inventory);
  if (!action) return;
  const newAlly = performOutCombatAllyAction(action, ally);
  if (!newAlly) return;
  partySetter(old =>
    old.map(ally => {
      if (ally.id === newAlly.id) {
        return newAlly;
      } else {
        return ally;
      }
    })
  );
}
