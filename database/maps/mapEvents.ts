import { MutableRefObject } from 'react';
import { GameDialog } from '../dialogs';
import { Encounter } from '../encounters';
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
    },
  },
  {
    name: 'store-town-portal',
    id: 1,
    types: [EventType.portal],
    handler: (scene) => {
      scene.currentMapRef.current = MapSlug.town;
      scene.characterRef.current.position.x += 1;
      scene.characterRef.current.position.y -= 0.02;
    },
  },
  {
    name: 'town-dragon-cave-portal',
    id: 2,
    types: [EventType.portal],
    handler: (scene) => {
      scene.currentMapRef.current = MapSlug.test;
      scene.characterRef.current.position.x = 0;
      scene.characterRef.current.position.y = 0;
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
];
