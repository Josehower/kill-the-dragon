import { CombatAction, combatActions, DmgSource } from './actions';

type EnemyActions = {
  action: CombatAction;
  /* number to choose from find >= random num */
  frequency: number;
}[];

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
  speed: number;
  isDead: boolean;
  weakness?: DmgSource;
};

export type Enemy = {
  id: number;
  name: string;
  isAlly: boolean;
  actions: EnemyActions;
  stats: CombatStats;
};

export const gameEnemies: Enemy[] = [
  {
    id: 1,
    name: 'Wolf',
    actions: [{ action: combatActions[0], frequency: 1 }],
    stats: {
      lvl: 1,
      hp: 20,
      pDmg: 5,
      mDmg: 0,
      dex: 0,
      acc: 0,
      pDef: 1,
      mDef: 1,
      speed: 1,
      weakness: DmgSource.physic,
      isDead: false,
    },
    isAlly: false,
  },
  {
    id: 2,
    name: 'Mage initiate',
    actions: [
      { action: combatActions[1], frequency: 0.4 },
      { action: combatActions[2], frequency: 0.8 },
      { action: combatActions[0], frequency: 1 },
    ],
    stats: {
      lvl: 2,
      hp: 50,
      pDmg: 10,
      mDmg: 20,
      dex: 0,
      acc: 0,
      pDef: 0.95,
      mDef: 0.95,
      speed: 1,
      weakness: DmgSource.fire,
      isDead: false,
    },
    isAlly: false,
  },
  {
    id: 3,
    name: 'Mage adept',
    actions: [
      { action: combatActions[0], frequency: 0.8 },
      { action: combatActions[3], frequency: 1 },
    ],
    stats: {
      lvl: 2,
      hp: 50,
      pDmg: 25,
      mDmg: 10,
      dex: 0,
      acc: 0,
      pDef: 1,
      mDef: 1,
      speed: 1,
      weakness: DmgSource.thunder,
      isDead: false,
    },
    isAlly: false,
  },
  {
    id: 4,
    name: 'Sorcerer adept',
    actions: [
      { action: combatActions[3], frequency: 0.4 },
      { action: combatActions[4], frequency: 0.8 },
      { action: combatActions[0], frequency: 1 },
    ],
    stats: {
      lvl: 3,
      hp: 80,
      pDmg: 15,
      mDmg: 25,
      dex: 0.15,
      acc: 0.2,
      pDef: 1,
      mDef: 0.9,
      speed: 1,
      weakness: DmgSource.earth,
      isDead: false,
    },
    isAlly: false,
  },
  {
    id: 5,
    name: 'Crusader adept',
    actions: [
      { action: combatActions[0], frequency: 0.4 },
      { action: combatActions[4], frequency: 0.8 },
      { action: combatActions[5], frequency: 1 },
    ],
    stats: {
      lvl: 4,
      hp: 100,
      pDmg: 25,
      mDmg: 15,
      dex: 0.2,
      acc: 0.15,
      pDef: 0.9,
      mDef: 1,
      speed: 1,
      weakness: DmgSource.water,
      isDead: false,
    },
    isAlly: false,
  },
  {
    id: 6,
    name: 'Dragon',
    actions: [
      { action: combatActions[1], frequency: 0.4 },
      { action: combatActions[4], frequency: 0.8 },
      { action: combatActions[8], frequency: 0.9 },
      { action: combatActions[9], frequency: 1 },
    ],
    stats: {
      lvl: 5,
      hp: 700,
      pDmg: 50,
      mDmg: 40,
      dex: 0.2,
      acc: 0.2,
      pDef: 0.75,
      mDef: 0.75,
      speed: 3,
      weakness: DmgSource.physic,
      isDead: false,
    },
    isAlly: false,
  },
];
