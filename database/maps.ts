export enum MapSlug {
  town = 'town.json',
}

export enum LocationEvent {
  encounter = 'ENCOUNTER',
  portal = 'PORTAL',
  prompt = 'PROMPT',
}

export type MapLocation = {
  x: number;
  y: number;
  event:
    | {
        type: LocationEvent.encounter | LocationEvent.prompt;
        eventObjectId: number;
      }
    | {
        type: LocationEvent.portal;
        eventObjectId: number;
        targetLocation: { x: number; y: number };
      };
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
    width: 20,
    height: 12,
    locations: [
      {
        x: -5,
        y: 0,
        event: {
          type: LocationEvent.encounter,
          eventObjectId: 1,
        },
      },
      {
        x: 3,
        y: 0,
        event: {
          type: LocationEvent.encounter,
          eventObjectId: 2,
        },
      },
      {
        x: 0,
        y: 2,
        event: {
          type: LocationEvent.portal,
          eventObjectId: 2,
          targetLocation: { x: -1, y: 1 },
        },
      },
      {
        x: 1,
        y: 2,
        event: {
          type: LocationEvent.portal,
          eventObjectId: 2,
          targetLocation: { x: 0, y: 1 },
        },
      },
      {
        x: 0,
        y: -2,
        event: {
          type: LocationEvent.prompt,
          eventObjectId: 1,
        },
      },
      {
        x: -3,
        y: -2,
        event: {
          type: LocationEvent.prompt,
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
        x: -1,
        y: 0,
        event: {
          type: LocationEvent.portal,
          eventObjectId: 1,
          targetLocation: { x: 0, y: 1 },
        },
      },
      {
        x: 0,
        y: 0,
        event: {
          type: LocationEvent.portal,
          eventObjectId: 1,
          targetLocation: { x: 1, y: 1 },
        },
      },
      {
        x: 0,
        y: 4,
        event: {
          type: LocationEvent.encounter,
          eventObjectId: 3,
        },
      },
    ],
  },
];
