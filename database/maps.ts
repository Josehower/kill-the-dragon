export enum LocationEvent {
  encounter = 'ENCOUNTER',
  portal = 'PORTAL',
  prompt = 'PROMPT',
}

export type MapLocation = {
  x: number;
  y: number;
  event: { type: LocationEvent; eventObjectId: number };
};

export type GameMap = {
  id: number;
  width: number;
  height: number;
  locations: MapLocation[];
};

export const maps: GameMap[] = [
  {
    id: 1,
    width: 14,
    height: 7,
    locations: [
      {
        x: -5,
        y: 2,
        event: {
          type: LocationEvent.encounter,
          eventObjectId: 1,
        },
      },
      {
        x: 3,
        y: 2,
        event: {
          type: LocationEvent.encounter,
          eventObjectId: 2,
        },
      },
      {
        x: 0,
        y: -2,
        event: {
          type: LocationEvent.encounter,
          eventObjectId: 3,
        },
      },
      {
        x: 0,
        y: 3,
        event: {
          type: LocationEvent.portal,
          eventObjectId: 2,
        },
      },
    ],
  },
  {
    id: 2,
    width: 8,
    height: 5,
    locations: [
      {
        x: 0,
        y: 2,
        event: {
          type: LocationEvent.portal,
          eventObjectId: 1,
        },
      },
    ],
  },
];
