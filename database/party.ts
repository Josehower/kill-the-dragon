import { getStatsByExp } from '../utils/miscelaneous';
import { actions, CombatAction } from './actions';
import { CombatStats } from './enemies';
import { GameWeapon } from './inventory';
import { levelStats } from './stats';

export type NonItemAction = Omit<CombatAction, 'fromItem'>;

export type Ally = {
  id: number;
  exp: number;
  name: string;
  currentHp: number;
  isAlly: boolean;
  actions: NonItemAction[];
  stats: CombatStats;
  weapon: GameWeapon | null;
  image?: string;
};

export const playerParty: Ally[] = [
  {
    id: 101,
    exp: 0,
    name: 'Bixby',
    get currentHp() {
      return getStatsByExp(this.exp).hp;
    },
    actions: [actions.strike, actions.blast, actions.shock, actions.flee],
    isAlly: true,
    weapon: null,
    stats: levelStats['lvl1'].stats,
    image: '/tile-sets/heros/warrior.png',
  },
  {
    id: 102,
    exp: 0,
    name: 'Ciri',
    get currentHp() {
      return getStatsByExp(this.exp).hp;
    },
    actions: [
      actions.strike,
      actions.fireBreath,
      actions.earthquake,
      actions.flee,
    ],
    isAlly: true,
    weapon: null,
    stats: levelStats['lvl1'].stats,
    image: '/tile-sets/heros/wizard.png',
  },
  {
    id: 103,
    exp: 0,
    name: 'Cortana',
    get currentHp() {
      return getStatsByExp(this.exp).hp;
    },
    actions: [
      actions.strike,
      actions.fireBreath,
      actions.earthquake,
      actions.flee,
    ],
    isAlly: true,
    weapon: null,
    stats: levelStats['lvl1'].stats,
    image: '/tile-sets/heros/samurai.png',
  },
  {
    id: 104,
    exp: 0,
    name: 'Alexa',
    get currentHp() {
      return getStatsByExp(this.exp).hp;
    },
    actions: [
      actions.strike,
      actions.fireBreath,
      actions.earthquake,
      actions.flee,
    ],
    isAlly: true,
    weapon: null,
    stats: levelStats['lvl1'].stats,
    image: '/tile-sets/heros/archer.png',
  },
];

function formatAllyActions(allyActionsArray: NonItemAction[], name: string) {
  allyActionsArray.forEach((action) => {
    if ('fromItem' in action) throw Error(`illegal action in ${name}`);
  });
  return allyActionsArray;
}

playerParty.forEach((ally) => formatAllyActions(ally.actions, ally.name));
