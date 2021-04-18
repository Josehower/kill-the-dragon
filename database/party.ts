import { CombatAction, combatActions } from './actions';
import { CombatStats } from './enemies';
import { gameLvlStats } from './stats';

export type Ally = {
  id: number;
  exp: number;
  name: string;
  currentHp: number;
  isAlly: boolean;
  actions: CombatAction[];
  stats: CombatStats;
};

export const playerParty: Ally[] = [
  {
    id: 1,
    exp: 0,
    name: 'Tidus',
    currentHp: gameLvlStats[0].stats.hp,
    actions: [
      combatActions[0],
      combatActions[1],
      combatActions[4],
      combatActions[5],
      combatActions[6],
    ],
    stats: gameLvlStats[0].stats,
    isAlly: true,
  },
  {
    id: 2,
    exp: 0,
    name: 'Silvia',
    currentHp: gameLvlStats[0].stats.hp,
    actions: [
      combatActions[0],
      combatActions[2],
      combatActions[3],
      combatActions[5],
      combatActions[6],
    ],
    stats: gameLvlStats[0].stats,
    isAlly: true,
  },
];
