import { actions, CombatAction, DmgSource } from './actions';
import { GameWeapon } from './inventory';

export type EnemyActions = {
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
  currentHp: number;
  isAlly: boolean;
  actions: EnemyActions;
  stats: CombatStats;
  weapon: GameWeapon | null;
  image?: string;
};

export type GameEnemies = {
  wolf: Enemy;
  mageInitiate: Enemy;
  magePolymorphist: Enemy;
  cockatrice: Enemy;
  ghost: Enemy;
  dragon: Enemy;
};

export const gameEnemies: GameEnemies = {
  wolf: {
    id: 1,
    name: 'Wolf',
    currentHp: 30,
    actions: [{ action: actions.strike, frequency: 1 }],
    stats: {
      lvl: 1,
      hp: 30,
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
    weapon: null,
    image: '/tile-sets/creatures/wolf-60x60.png',
  },
  mageInitiate: {
    id: 2,
    name: 'Mage Initiate',
    currentHp: 200,
    actions: [
      { action: actions.blast, frequency: 0.4 },
      { action: actions.tsunami, frequency: 0.8 },
      { action: actions.strike, frequency: 1 },
    ],
    stats: {
      lvl: 2,
      hp: 200,
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
    weapon: null,
    image: '/tile-sets/creatures/mage-initiate-128x128.png',
  },
  magePolymorphist: {
    id: 3,
    name: 'Mage Polymorphist',
    currentHp: 250,
    actions: [
      { action: actions.strike, frequency: 0.8 },
      { action: actions.shock, frequency: 1 },
    ],
    stats: {
      lvl: 2,
      hp: 250,
      pDmg: 30,
      mDmg: 40,
      dex: 0,
      acc: 0,
      pDef: 1,
      mDef: 1,
      speed: 1,
      weakness: DmgSource.thunder,
      isDead: false,
    },
    isAlly: false,
    weapon: null,
    image: '/tile-sets/creatures/mage-polymorphist-92x92.png',
  },
  cockatrice: {
    id: 4,
    name: 'Cockatrice',
    currentHp: 80,
    actions: [
      { action: actions.strike, frequency: 0.4 },
      { action: actions.blast, frequency: 0.8 },
      { action: actions.usePotion, frequency: 1 },
    ],
    stats: {
      lvl: 3,
      hp: 80,
      pDmg: 50,
      mDmg: 25,
      dex: 0.15,
      acc: 0.2,
      pDef: 1,
      mDef: 0.9,
      speed: 1.2,
      weakness: DmgSource.earth,
      isDead: false,
    },
    isAlly: false,
    weapon: null,
    image: '/tile-sets/creatures/cockatrice.png',
  },
  ghost: {
    id: 5,
    name: 'Ghost',
    currentHp: 100,
    actions: [
      { action: actions.shock, frequency: 0.4 },
      { action: actions.earthquake, frequency: 0.8 },
      { action: actions.usePotion, frequency: 1 },
    ],
    stats: {
      lvl: 4,
      hp: 100,
      pDmg: 25,
      mDmg: 25,
      dex: 0.2,
      acc: 0.15,
      pDef: 0.9,
      mDef: 1,
      speed: 1,
      weakness: DmgSource.water,
      isDead: false,
    },
    isAlly: false,
    weapon: null,
    image: '/tile-sets/creatures/ghost-50x50.png',
  },
  dragon: {
    id: 6,
    name: 'Dragon',
    currentHp: 1200,
    actions: [
      { action: actions.blast, frequency: 0.4 },
      { action: actions.earthquake, frequency: 0.8 },
      { action: actions.dragonBite, frequency: 0.9 },
      { action: actions.fireBreath, frequency: 1 },
    ],
    stats: {
      lvl: 5,
      hp: 1200,
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
    weapon: null,
    image: '/tile-sets/creatures/dragon-portrait.png',
  },
};
