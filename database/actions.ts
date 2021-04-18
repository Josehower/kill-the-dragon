// eslint-disable-next-line no-shadow
export enum DmgSource {
  fire = 'FIRE',
  water = 'WATER',
  thunder = 'THUNDER',
  earth = 'EARTH',
  physic = 'PHYSIC',
  heal = 'HEAL',
  revive = 'REVIVE',
}

export type CombatAction = {
  id: number;
  name: string;
  description: string;
  isFriendly?: true;
  isMagic?: true;
  dmgSource?: DmgSource;
};

export const combatActions: CombatAction[] = [
  {
    id: 1,
    name: 'Strike',
    description: 'Attacks the foe using the muscles',
    dmgSource: DmgSource.physic,
  },
  {
    id: 2,
    name: 'Blast',
    description: 'Burns the foe using magical forces',
    dmgSource: DmgSource.fire,
    isMagic: true,
  },
  {
    id: 3,
    name: 'Tsunami',
    description: 'Chokes the foe using magical forces',
    dmgSource: DmgSource.water,
    isMagic: true,
  },
  {
    id: 4,
    name: 'Shock',
    description: 'Electrocutes the foe using magical forces',
    dmgSource: DmgSource.thunder,
    isMagic: true,
  },
  {
    id: 5,
    name: 'Earthquake',
    description: 'Demolishes the foe using magical forces',
    dmgSource: DmgSource.earth,
    isMagic: true,
  },
  {
    id: 6,
    name: 'Use Potion',
    description: 'Use an item to take tactical advantage',
    dmgSource: DmgSource.heal,
    isFriendly: true,
  },
  {
    id: 7,
    name: 'Use Revive',
    description: 'Use an item to take tactical advantage',
    dmgSource: DmgSource.revive,
    isFriendly: true,
  },
  {
    id: 8,
    name: 'Flee',
    description: 'Escape is smart... sometimes',
  },
];
