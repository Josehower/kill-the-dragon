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
        ...gameEnemies[0],
        name: 'wolf 1',
        id: 1,
      },
      {
        ...gameEnemies[0],
        name: 'wolf 2',
        id: 2,
      },
      {
        ...gameEnemies[1],
        name: 'mage 1',
        id: 3,
      },
      {
        ...gameEnemies[2],
        name: 'wolf 2',
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
        ...gameEnemies[3],
        name: 'Fiona',
        id: 1,
      },
      {
        ...gameEnemies[3],
        name: 'Louis',
        id: 2,
      },
      {
        ...gameEnemies[4],
        name: 'Martha',
        id: 3,
      },
      {
        ...gameEnemies[4],
        name: 'Peter',
        id: 4,
      },
    ],
    expReward: 40,
    goldReward: 20,
  },
  {
    id: 3,
    enemyTeam: [{ ...gameEnemies[5] }],
    expReward: 40,
    goldReward: 20,
  },
];
