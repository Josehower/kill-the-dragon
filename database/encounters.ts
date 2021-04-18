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
      { ...gameEnemies[0], stats: { ...gameEnemies[0].stats }, id: 1 },
      { ...gameEnemies[0], stats: { ...gameEnemies[0].stats }, id: 2 },
      { ...gameEnemies[1], stats: { ...gameEnemies[1].stats }, id: 3 },
      { ...gameEnemies[2], stats: { ...gameEnemies[2].stats }, id: 4 },
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
        stats: { ...gameEnemies[3].stats },
        id: 1,
      },
      {
        ...gameEnemies[3],
        name: 'Louis',
        stats: { ...gameEnemies[3].stats },
        id: 2,
      },
      {
        ...gameEnemies[4],
        name: 'Martha',
        stats: { ...gameEnemies[4].stats },
        id: 3,
      },
      {
        ...gameEnemies[4],
        name: 'Peter',
        stats: { ...gameEnemies[4].stats },
        id: 4,
      },
    ],
    expReward: 40,
    goldReward: 20,
  },
  {
    id: 3,
    enemyTeam: [{ ...gameEnemies[5], stats: { ...gameEnemies[5].stats } }],
    expReward: 40,
    goldReward: 20,
  },
];
