import { DmgSource } from './actions';

export type CombatStats = {
  lvl: number;
  hp: number;
  pDmg: number;
  mDmg: number;
  // percentage of times that dodge eg. 10% === 0.1
  dex: number;
  acc: number;
  // percentage of damage caused when apply eg. 80% === 0.8
  pDef: number;
  mDef: number;
  isDead: boolean;
  weakness?: DmgSource;
};

type Enemy = {
  id: number;
  name: string;
  stats: CombatStats;
};

export const gameEnemies: Enemy[] = [
  {
    id: 1,
    name: 'Wolf',
    stats: {
      lvl: 1,
      hp: 20,
      pDmg: 5,
      mDmg: 0,
      dex: 0,
      acc: 0,
      pDef: 0,
      mDef: 0,
      weakness: DmgSource.physic,
      isDead: false,
    },
  },
  {
    id: 2,
    name: 'Ella Jarvis',
    stats: {
      lvl: 2,
      hp: 50,
      pDmg: 10,
      mDmg: 20,
      dex: 0,
      acc: 0,
      pDef: 0.95,
      mDef: 0.95,
      weakness: DmgSource.fire,
      isDead: false,
    },
  },
  {
    id: 3,
    name: 'Maggie Ortega',
    stats: {
      lvl: 2,
      hp: 50,
      pDmg: 25,
      mDmg: 10,
      dex: 0,
      acc: 0,
      pDef: 0,
      mDef: 0,
      weakness: DmgSource.thunder,
      isDead: false,
    },
  },
  {
    id: 4,
    name: 'Sorcerer adept',
    stats: {
      lvl: 3,
      hp: 80,
      pDmg: 15,
      mDmg: 25,
      dex: 0.15,
      acc: 0.2,
      pDef: 0,
      mDef: 0.9,
      weakness: DmgSource.earth,
      isDead: false,
    },
  },
  {
    id: 5,
    name: 'Crusader adept',
    stats: {
      lvl: 4,
      hp: 100,
      pDmg: 25,
      mDmg: 15,
      dex: 0.2,
      acc: 0.15,
      pDef: 0.9,
      mDef: 0,
      weakness: DmgSource.water,
      isDead: false,
    },
  },
  {
    id: 6,
    name: 'Dragon',
    stats: {
      lvl: 5,
      hp: 700,
      pDmg: 40,
      mDmg: 40,
      dex: 0.2,
      acc: 0.2,
      pDef: 0.75,
      mDef: 0.75,
      weakness: DmgSource.physic,
      isDead: false,
    },
  },
];
