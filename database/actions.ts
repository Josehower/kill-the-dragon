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
  isFlee?: true;
  dmgSource?: DmgSource;
  dmgMod?: number;
  fromItem?: true;
};

export type ActionsObject = {
  strike: CombatAction;
  blast: CombatAction;
  tsunami: CombatAction;
  shock: CombatAction;
  earthquake: CombatAction;
  usePotion: CombatAction;
  useRevive: CombatAction;
  flee: CombatAction;
  dragonBite: CombatAction;
  fireBreath: CombatAction;
};

export const actions: ActionsObject = {
  strike: {
    id: 1,
    name: 'Strike',
    description: 'Attacks the foe using the muscles',
    dmgSource: DmgSource.physic,
  },
  blast: {
    id: 2,
    name: 'Blast',
    description: 'Burns the foe using magical forces',
    dmgSource: DmgSource.fire,
    isMagic: true,
  },
  tsunami: {
    id: 3,
    name: 'Tsunami',
    description: 'Chokes the foe using magical forces',
    dmgSource: DmgSource.water,
    isMagic: true,
  },
  shock: {
    id: 4,
    name: 'Shock',
    description: 'Electrocutes the foe using magical forces',
    dmgSource: DmgSource.thunder,
    isMagic: true,
  },
  earthquake: {
    id: 5,
    name: 'Earthquake',
    description: 'Demolishes the foe using magical forces',
    dmgSource: DmgSource.earth,
    isMagic: true,
  },
  usePotion: {
    id: 6,
    name: 'Use Potion',
    description: 'Use an item to take tactical advantage',
    dmgSource: DmgSource.heal,
    isFriendly: true,
    fromItem: true,
  },
  useRevive: {
    id: 7,
    name: 'Use Revive',
    description: 'Use an item to take tactical advantage',
    dmgSource: DmgSource.revive,
    isFriendly: true,
    fromItem: true,
  },
  flee: {
    id: 8,
    name: 'Flee',
    description: 'Escape is smart... sometimes',
    isFlee: true,
  },
  dragonBite: {
    id: 9,
    name: 'Dragon Bite',
    description: 'The end is close!!!',
    dmgSource: DmgSource.physic,
  },
  fireBreath: {
    id: 10,
    name: 'Fire Breath',
    description: 'What do you expect from a Dragon',
    dmgSource: DmgSource.fire,
    dmgMod: 1.5,
  },
};
