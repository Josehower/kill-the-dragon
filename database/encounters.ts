import { Enemy, gameEnemies } from './enemies';

export type Encounter = {
  id: number;
  enemyTeam: Enemy[];
  expReward: number;
  goldReward: number;
  background?: string;
};

export const gameEncounters: Encounter[] = [
  {
    id: 1,
    enemyTeam: [
      {
        ...gameEnemies.wolf,
        name: 'wolf I',
        id: 1,
      },
      {
        ...gameEnemies.wolf,
        name: 'wolf II',
        id: 2,
      },
      {
        ...gameEnemies.mageInitiate,
        name: 'Mage Initiate',
        id: 3,
      },
      {
        ...gameEnemies.wolf,
        name: 'wolf III',
        id: 4,
      },
    ],
    expReward: 40,
    goldReward: 20,
    background: '/backgrounds/dragons-cave.jpg',
  },
  {
    id: 2,
    enemyTeam: [
      {
        ...gameEnemies.magePolymorphist,
        name: 'Fiona, The Polymorphist',
        id: 1,
      },
      {
        ...gameEnemies.cockatrice,
        name: 'Cockatrice I',
        id: 2,
      },
      {
        ...gameEnemies.cockatrice,
        name: 'Cockatrice II',
        id: 3,
      },
      {
        ...gameEnemies.ghost,
        name: 'Peter Ghost',
        id: 4,
      },
    ],
    expReward: 40,
    goldReward: 20,
    background: '/backgrounds/dragons-cave.jpg',
  },
  {
    id: 3,
    enemyTeam: [{ ...gameEnemies.dragon }],
    expReward: 400,
    goldReward: 20,
    background: '/backgrounds/dragons-cave.jpg',
  },
];
