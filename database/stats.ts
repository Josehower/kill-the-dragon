import { CombatStats } from './enemies';

type PlayerLvlStats = {
  id: number;
  stats: CombatStats;
};

type StatsByLevel = {
  lvl1: PlayerLvlStats;
  lvl2: PlayerLvlStats;
  lvl3: PlayerLvlStats;
  lvl4: PlayerLvlStats;
  lvl5: PlayerLvlStats;
};

export const levelStats: StatsByLevel = {
  lvl1: {
    id: 1,
    stats: {
      lvl: 1,
      hp: 50,
      pDmg: 20,
      mDmg: 20,
      dex: 0,
      acc: 0,
      pDef: 1,
      mDef: 1,
      speed: 1.5,
      isDead: false,
    },
  },
  lvl2: {
    id: 2,
    stats: {
      lvl: 2,
      hp: 50,
      pDmg: 25,
      mDmg: 25,
      dex: 0.05,
      acc: 0.05,
      pDef: 0.95,
      mDef: 0.95,
      speed: 1.5,
      isDead: false,
    },
  },
  lvl3: {
    id: 3,
    stats: {
      lvl: 3,
      hp: 60,
      pDmg: 30,
      mDmg: 30,
      dex: 0.1,
      acc: 0.1,
      pDef: 0.9,
      mDef: 0.9,
      speed: 1.8,
      isDead: false,
    },
  },
  lvl4: {
    id: 4,
    stats: {
      lvl: 4,
      hp: 80,
      pDmg: 40,
      mDmg: 40,
      dex: 0.1,
      acc: 0.1,
      pDef: 0.85,
      mDef: 0.85,
      speed: 1.8,
      isDead: false,
    },
  },
  lvl5: {
    id: 5,
    stats: {
      lvl: 5,
      hp: 100,
      pDmg: 50,
      mDmg: 50,
      dex: 0.2,
      acc: 0.2,
      pDef: 0.8,
      mDef: 0.8,
      speed: 2,
      isDead: false,
    },
  },
};
