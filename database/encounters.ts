import { Enemy, gameEnemies } from './enemies';

export type Encounter = {
  id: number;
  enemyTeam: Enemy[];
  expReward: number;
  goldReward: number;
};

export const gameEncounters: Encounter[] = [
  {
    id: 1,
    enemyTeam: [
      {
        ...gameEnemies.wolf,
        name: 'wolf 1',
        id: 1,
      },
      {
        ...gameEnemies.wolf,
        name: 'wolf 2',
        id: 2,
      },
      {
        ...gameEnemies.mageInitiate,
        name: 'mage 1',
        id: 3,
      },
      {
        ...gameEnemies.wolf,
        name: 'wolf 3',
        id: 4,
      },
    ],
    expReward: 40,
    goldReward: 20,
  },
  {
    id: 2,
    enemyTeam: [
      {
        ...gameEnemies.mageAdept,
        name: 'Fiona',
        id: 1,
      },
      {
        ...gameEnemies.sorcererAdept,
        name: 'Louis',
        id: 2,
      },
      {
        ...gameEnemies.sorcererAdept,
        name: 'Martha',
        id: 3,
      },
      {
        ...gameEnemies.mageAdept,
        name: 'Peter',
        id: 4,
      },
    ],
    expReward: 40,
    goldReward: 20,
  },
  {
    id: 3,
    enemyTeam: [{ ...gameEnemies.dragon }],
    expReward: 400,
    goldReward: 20,
  },
];
