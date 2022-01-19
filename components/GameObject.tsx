import { css } from '@emotion/react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import * as three from 'three';
import { Encounter, gameEncounters } from '../database/encounters';
import { GameItem, GameWeapon } from '../database/inventory';
import { GameMap, LocationEvent, MapLocation, maps } from '../database/maps';
import { Ally, playerParty } from '../database/party';
import { BaseFloor } from '../structures/BaseFloor';
import { MainCharacter } from '../structures/MainCharacter';
import Battle from './Battle';
import BattleControl from './BattleControl';
import Menu from './Menu';
import Store from './Store';

export type PlayerInventory = {
  gold: number;
  items: { item: GameItem; qty: number }[];
  weapons: { weapon: GameWeapon; qty: number }[];
};

export type GameStateContext = {
  party: Ally[];
  setParty: Dispatch<SetStateAction<Ally[]>>;
  partyInventory: PlayerInventory;
  setPartyInventory: Dispatch<SetStateAction<PlayerInventory>>;
};

export const gameStateContext = createContext<GameStateContext | null>(null);

export default function GameObject() {
  const charRef = useRef<three.Sprite>();
  const [currentMap, setCurrentMap] = useState<GameMap>(maps[0]);
  const [party, setParty] = useState<Ally[]>(() => playerParty);
  const [partyInventory, setPartyInventory] = useState<PlayerInventory>({
    gold: 0,
    items: [],
    weapons: [],
  });
  const [encounter, setEncounter] = useState<Encounter | null>(null);

  const partyContextValue: GameStateContext = {
    party,
    setParty,
    partyInventory,
    setPartyInventory,
  };

  useFrame(() => {
    if (!charRef.current) return;
    if (encounter) return;

    if (
      currentMap.locations.some(location => {
        return (
          location.x === Math.round(charRef.current?.position.x as number) &&
          location.y === Math.round(charRef.current?.position.y as number)
        );
      })
    ) {
      console.log('combat');

      const currentLocation = currentMap.locations.find(
        location =>
          location.x === Math.round(charRef.current?.position.x as number) &&
          location.y === Math.round(charRef.current?.position.y as number)
      ) as MapLocation;

      const eventResolvers = {
        [LocationEvent.encounter]: (id: number) =>
          setEncounter(gameEncounters.find(enc => enc.id === id) as Encounter),
        [LocationEvent.portal]: (id: number) =>
          setCurrentMap(maps.find(map => map.id === id) as GameMap),
        [LocationEvent.prompt]: (id: number) => setCurrentMap(maps[id]),
      };
      const currentEvent = currentLocation.event;

      eventResolvers[currentEvent.type](currentEvent.eventObjectId);
    }
  });

  if (encounter) {
    return (
      <>
        <Html fullscreen>
          <gameStateContext.Provider value={partyContextValue}>
            <Battle encounter={encounter} setEncounter={setEncounter} />
          </gameStateContext.Provider>
        </Html>
      </>
    );
  }

  return (
    <>
      <BaseFloor map={currentMap} setEncounter={setEncounter} />
      <MainCharacter charRef={charRef} />
      <Html
        fullscreen
        css={css`
          pointer-events: none;
        `}
      >
        <gameStateContext.Provider value={partyContextValue}>
          <div
            css={css`
              pointer-events: all;
            `}
          >
            <h2>Menu</h2>
            <Store />
            <Menu />
          </div>
        </gameStateContext.Provider>
      </Html>
    </>
  );
}
