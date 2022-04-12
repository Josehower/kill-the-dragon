import { MutableRefObject } from 'react';
import { GameDialog } from '../dialogs';
import { Encounter, gameEncounters } from '../encounters';
import { MapSlug } from './mapList';

export enum EventType {
  encounter = 'ENCOUNTER',
  portal = 'PORTAL',
  prompt = 'PROMPT',
}

type SceneRef = {
  characterRef: MutableRefObject<THREE.Sprite>;
  currentMapRef: MutableRefObject<MapSlug>;
  promptDialogRef: MutableRefObject<GameDialog | null>;
  encounterRef: MutableRefObject<Encounter | null>;
  toggleStoreRef: MutableRefObject<boolean>;
  toggleMenuRef: MutableRefObject<boolean>;
};

export type MapEvent = {
  name: string;
  id: number;
  types: EventType[];
  handler: (scene: SceneRef) => void;
};

export const gameMapEvents: MapEvent[] = [
  {
    name: 'town-store-portal',
    id: 0,
    types: [EventType.portal],
    handler: (scene) => {
      scene.currentMapRef.current = MapSlug.store;
      scene.characterRef.current.position.x -= 1;
      scene.characterRef.current.position.y -= 1;
    },
  },
  {
    name: 'store-town-portal',
    id: 1,
    types: [EventType.portal],
    handler: (scene) => {
      scene.currentMapRef.current = MapSlug.town;
      scene.characterRef.current.position.x += 1;
      scene.characterRef.current.position.y += 0.99;
    },
  },
  {
    name: 'town-dragon-cave-portal',
    id: 2,
    types: [EventType.portal],
    handler: (scene) => {
      scene.currentMapRef.current = MapSlug.dragon;
      scene.characterRef.current.position.x = 11;
      scene.characterRef.current.position.y = -1.5;
    },
  },
  {
    name: 'store-open',
    id: 3,
    types: [EventType.portal],
    handler: (scene) => {
      scene.toggleStoreRef.current = true;
    },
  },
  {
    name: 'menu-open',
    id: 4,
    types: [EventType.portal],
    handler: (scene) => {
      scene.toggleMenuRef.current = true;
    },
  },
  {
    name: 'dragon-cave-town-portal',
    id: 5,
    types: [EventType.portal],
    handler: (scene) => {
      scene.currentMapRef.current = MapSlug.town;
      scene.characterRef.current.position.x = -7;
      scene.characterRef.current.position.y = -4;
    },
  },
  {
    name: 'wolf-encounter',
    id: 6,
    types: [EventType.encounter],
    handler: (scene) => {
      scene.encounterRef.current = gameEncounters[0];
    },
  },
  {
    name: 'cockatrice-encounter',
    id: 7,
    types: [EventType.encounter],
    handler: (scene) => {
      scene.encounterRef.current = gameEncounters[1];
    },
  },
  {
    name: 'dragon-encounter',
    id: 8,
    types: [EventType.encounter],
    handler: (scene) => {
      scene.encounterRef.current = gameEncounters[2];
    },
  },
];
