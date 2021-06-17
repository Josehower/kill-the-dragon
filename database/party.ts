import { actions, CombatAction } from './actions';
import { CombatStats } from './enemies';
import { levelStats } from './stats';

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
    id: 101,
    exp: 0,
    name: 'Tidus',
    currentHp: levelStats.lvl1.stats.hp,
    actions: [
      actions.strike,
      actions.blast,
      actions.shock,
      actions.usePotion,
      actions.flee,
    ],
    stats: levelStats.lvl1.stats,
    isAlly: true,
  },
  {
    id: 102,
    exp: 0,
    name: 'Silvia',
    currentHp: levelStats.lvl1.stats.hp,
    actions: [
      actions.strike,
      actions.earthquake,
      actions.useRevive,
      actions.usePotion,
      actions.flee,
    ],
    stats: levelStats.lvl1.stats,
    isAlly: true,
  },
  {
    id: 103,
    exp: 0,
    name: 'Janos',
    currentHp: levelStats.lvl1.stats.hp,
    actions: [actions.fireBreath, actions.blast],
    stats: levelStats.lvl1.stats,
    isAlly: true,
  },
];
