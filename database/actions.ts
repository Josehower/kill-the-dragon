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
  duration: number;
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
    duration: 2000,
  },
  blast: {
    id: 2,
    name: 'Blast',
    description: 'Burns the foe using magical forces',
    dmgSource: DmgSource.fire,
    duration: 4000,
    isMagic: true,
  },
  tsunami: {
    id: 3,
    name: 'Tsunami',
    description: 'Chokes the foe using magical forces',
    dmgSource: DmgSource.water,
    duration: 4000,
    isMagic: true,
  },
  shock: {
    id: 4,
    name: 'Shock',
    description: 'Electrocutes the foe using magical forces',
    dmgSource: DmgSource.thunder,
    duration: 4000,
    isMagic: true,
  },
  earthquake: {
    id: 5,
    name: 'Earthquake',
    description: 'Demolishes the foe using magical forces',
    dmgSource: DmgSource.earth,
    duration: 3000,
    isMagic: true,
  },
  usePotion: {
    id: 6,
    name: 'Use Potion',
    description: 'Use an item to take tactical advantage',
    dmgSource: DmgSource.heal,
    duration: 3000,
    isFriendly: true,
    fromItem: true,
  },
  useRevive: {
    id: 7,
    name: 'Use Revive',
    description: 'Use an item to take tactical advantage',
    dmgSource: DmgSource.revive,
    duration: 2000,
    isFriendly: true,
    fromItem: true,
  },
  flee: {
    id: 8,
    name: 'Flee',
    description: 'Escape is smart... sometimes',
    duration: 500,
    isFlee: true,
  },
  dragonBite: {
    id: 9,
    name: 'Dragon Bite',
    description: 'The end is close!!!',
    dmgSource: DmgSource.physic,
    duration: 2000,
  },
  fireBreath: {
    id: 10,
    name: 'Fire Breath',
    description: 'What do you expect from a Dragon',
    dmgSource: DmgSource.fire,
    duration: 5000,
    dmgMod: 1.5,
  },
};
