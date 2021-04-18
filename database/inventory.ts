import { DmgSource } from './actions';

export interface GameItem {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface GameWeapon extends GameItem {
  dmgAffinity: DmgSource[];
  // damage multiplier eg. 1.2 makes 20% more damage amd 1 makes 0% more damage
  dmgMod: number;
}

export const gameItems: (GameItem | GameWeapon)[] = [
  {
    id: 1,
    name: 'potion',
    price: 50,
    description: 'Restore 50HP of a party member',
  },
  {
    id: 2,
    name: 'Revive',
    price: 100,
    description: 'Revive a dead party member with 40HP',
  },
  {
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
  },
  {
    id: 4,
    name: 'Short Sword',
    price: 20,
    description: 'Empowers physical attacks',
    dmgAffinity: [DmgSource.physic],
    dmgMod: 1.3,
  },
];
