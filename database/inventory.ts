import { Dispatch, SetStateAction } from 'react';
import { PlayerInventory } from '../components/structures/DomBasedComponent';
import { getUseItemFunc } from '../utils/inventory';
import { actions, CombatAction, DmgSource } from './actions';

export interface GameItem {
  id: number;
  name: string;
  price: number;
  description: string;
  isWeapon?: true;
  useItem: (
    inventory: [PlayerInventory, Dispatch<SetStateAction<PlayerInventory>>],
  ) => CombatAction | null;
}

export interface GameWeapon extends Omit<GameItem, 'useItem'> {
  dmgAffinity: DmgSource[];
  // damage multiplier eg. 1.2 makes 20% more damage amd 1 makes 0% more damage
  dmgMod: number;
}

export type GameItems = {
  potion: GameItem;
  revive: GameItem;
  Rod: GameWeapon;
  ShortSword: GameWeapon;
};

export const gameItems: GameItems = {
  potion: {
    id: 1,
    name: 'potion',
    price: 50,
    description: 'Restore 50HP of a party member',
    useItem: getUseItemFunc(1, actions.usePotion),
  },
  revive: {
    id: 2,
    name: 'Revive',
    price: 100,
    description: 'Revive a dead party member with 40HP',
    useItem: getUseItemFunc(2, actions.useRevive),
  },
  Rod: {
    id: 3,
    name: 'Rod',
    price: 20,
    description: 'Empowers magic attacks',
    dmgAffinity: [
      DmgSource.earth,
      DmgSource.thunder,
      DmgSource.fire,
      DmgSource.water,
    ],
    dmgMod: 1.3,
    isWeapon: true,
  },
  ShortSword: {
    id: 4,
    name: 'Short Sword',
    price: 20,
    description: 'Empowers physical attacks',
    dmgAffinity: [DmgSource.physic],
    dmgMod: 1.3,
    isWeapon: true,
  },
};
