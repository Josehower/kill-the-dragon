import { CombatStats } from '../database/enemies';
import { levelStats } from '../database/stats';

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

export function getStatsByExp(exp: number) {
  const lvls = {
    '100': 'lvl1' as const,
    '200': 'lvl2' as const,
    '500': 'lvl3' as const,
    '800': 'lvl4' as const,
    '1300': 'lvl5' as const,
  };

  const entry = Object.entries(lvls).find(([key]) => {
    return exp < Number(key);
  });

  if (!entry) {
    return levelStats['lvl5'].stats;
  }

  return levelStats[entry[1]].stats;
}
