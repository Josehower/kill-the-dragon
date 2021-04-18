import { CombatStats } from '../database/enemies';

export function getRandomFromArray(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function formatStats(stats: CombatStats) {
  return {
    ...stats,
    dex: Math.round(stats.dex * 100),
    acc: Math.round(stats.acc * 100),
    pDef: Math.round((1 - stats.pDef) * 100),
    mDef: Math.round((1 - stats.mDef) * 100),
  };
}
