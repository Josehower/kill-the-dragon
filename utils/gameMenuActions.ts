import { Dispatch, SetStateAction } from 'react';
import { PlayerInventory } from '../components/structures/DomBasedComponent';
import { GameItem } from '../database/inventory';
import { Ally } from '../database/party';
import { performOutCombatAllyAction } from './outCombat';

export function activeItemOutOfCombat(
  gameItem: GameItem,
  ally: Ally,
  partySetter: Dispatch<SetStateAction<Ally[]>>,
  inventory: [PlayerInventory, Dispatch<SetStateAction<PlayerInventory>>],
) {
  const action = gameItem.useItem(inventory);
  if (!action) return;
  const newAlly = performOutCombatAllyAction(action, ally);
  partySetter((old) =>
    old.map((oldAlly) => {
      if (oldAlly.id === newAlly.id) {
        return newAlly;
      } else {
        return oldAlly;
      }
    }),
  );
}
