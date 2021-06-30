import { actions, CombatAction } from './actions';
import { CombatStats } from './enemies';
import { GameWeapon } from './inventory';
import { levelStats } from './stats';

type nonItemAction = Omit<CombatAction, 'fromItem'>;

export type Ally = {
  id: number;
  exp: number;
  name: string;
  currentHp: number;
  isAlly: boolean;
  actions: nonItemAction[];
  stats: CombatStats;
  weapon: GameWeapon | null;
};

export const playerParty: Ally[] = [
  {
    id: 101,
    exp: 0,
    name: 'Tidus',
    currentHp: levelStats.lvl1.stats.hp,
    actions: [actions.strike, actions.blast, actions.shock, actions.flee],
    stats: levelStats.lvl1.stats,
    isAlly: true,
    weapon: null,
  },
  {
    id: 102,
    exp: 0,
    name: 'Silvia',
    currentHp: levelStats.lvl1.stats.hp,
    actions: [actions.strike, actions.earthquake, actions.flee],
    stats: levelStats.lvl1.stats,
    isAlly: true,
    weapon: null,
  },
  {
    id: 103,
    exp: 0,
    name: 'Jakob',
    currentHp: levelStats.lvl1.stats.hp,
    actions: [actions.fireBreath, actions.blast, actions.flee, actions.shock],
    stats: levelStats.lvl1.stats,
    isAlly: true,
    weapon: null,
  },
  {
    id: 104,
    exp: 0,
    name: 'Teo',
    currentHp: levelStats.lvl1.stats.hp,
    actions: [actions.shock, actions.strike],
    stats: levelStats.lvl1.stats,
    isAlly: true,
    weapon: null,
  },
];

function formatAllyActions(allyActionsArray: nonItemAction[], name: string) {
  allyActionsArray.forEach(action => {
    if ('fromItem' in action) throw Error(`illegal action in ${name}`);
  });
  return allyActionsArray;
}

playerParty.forEach(ally => formatAllyActions(ally.actions, ally.name));
