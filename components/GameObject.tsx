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
import { GameDialog, gameDialogs } from '../database/dialogs';
import { Encounter, gameEncounters } from '../database/encounters';
import { GameItem, GameWeapon } from '../database/inventory';
import { GameMap, LocationEvent, MapLocation, maps } from '../database/maps';
import { Ally, playerParty } from '../database/party';
import useControls from '../hooks/useControls';
import { MainCharacter } from '../structures/MainCharacter';
import Battle from './Battle';
import Menu from './Menu';
import Prompt from './Prompt';
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

export default function GameObject({
  mapRef,
}: {
  mapRef: MutableRefObject<GameMap>;
}) {
  console.log('render a');
  const timeRef = useRef<number>(900);
  const posRef = useRef<number>(1);
  const charRef = useRef<three.Sprite>();
  const flag = useRef<boolean>(true);
  const [isCharacterFreezed, setIsCharacterFreezed] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number }>();
  const [promptDialog, setPromptDialog] = useState<GameDialog>();
  // const [currentMap, setCurrentMap] = useState<GameMap>(maps[0]);
  const [party, setParty] = useState<Ally[]>(() => playerParty);
  const [partyInventory, setPartyInventory] = useState<PlayerInventory>({
    gold: 0,
    items: [],
    weapons: [],
  });
  const [encounter, setEncounter] = useState<Encounter | null>(null);

  const controls = useControls();
  const movementSpeed = 0.05;

  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const [toggleStore, setToggleStore] = useState(false);

  const partyContextValue: GameStateContext = {
    party,
    setParty,
    partyInventory,
    setPartyInventory,
  };

  useFrame(({ clock }) => {
    if (!charRef.current) return;
    if (encounter) return;

    if (
      mapRef.current.locations.some((location) => {
        return (
          location.x === Math.round(charRef.current?.position.x as number) &&
          location.y === Math.round(charRef.current?.position.y as number)
        );
      })
    ) {
      const eventLocation = mapRef.current.locations.find(
        (location) =>
          location.x === Math.round(charRef.current?.position.x as number) &&
          location.y === Math.round(charRef.current?.position.y as number),
      ) as MapLocation;

      const eventResolvers = {
        [LocationEvent.encounter]: (id: number) =>
          setEncounter(
            gameEncounters.find((enc) => enc.id === id) as Encounter,
          ),
        [LocationEvent.portal]: (id: number) => {
          const newMap = maps.find((map) => map.id === id) as GameMap;
          mapRef.current = newMap;
        },
        [LocationEvent.prompt]: (id: number) =>
          setPromptDialog(
            gameDialogs.find((enc) => enc.id === id) as GameDialog,
          ),
      };
      const currentEvent = eventLocation.event;

      if (currentEvent.type === LocationEvent.portal) {
        charRef.current.position.x = currentEvent.targetLocation.x;
        charRef.current.position.y = currentEvent.targetLocation.y;
      }

      // TODO: fix this is not nice
      if (
        currentEvent.type === LocationEvent.encounter ||
        currentEvent.type === LocationEvent.prompt
      ) {
        // charRef.current.position.x = currentLocation.x;
        // charRef.current.position.y = currentLocation.y - 1;

        const charPx = eventLocation.x - charRef.current.position.x;
        const charPy = eventLocation.y - charRef.current.position.y;

        let x =
          Math.sqrt(Math.pow(charPx, 2)) > 0.4
            ? charPx > 0
              ? eventLocation.x - 0.6
              : eventLocation.x + 0.6
            : charRef.current.position.x;

        const y =
          Math.sqrt(Math.pow(charPy, 2)) > 0.4
            ? charPy > 0
              ? eventLocation.y - 0.6
              : eventLocation.y + 0.6
            : charRef.current.position.y;

        if (eventLocation.y === y && eventLocation.x === x) {
          x--;
        }

        console.log(x, y);
        console.log('heree');
        if (currentEvent.type === LocationEvent.prompt) {
          charRef.current.position.x = x;
          charRef.current.position.y = y;
          setIsCharacterFreezed(true);
        } else {
          setLastPosition((current) => {
            return {
              ...current,
              x,
              y,
            };
          });
        }
      }

      eventResolvers[currentEvent.type](currentEvent.eventObjectId);
    }

    if (isCharacterFreezed) return;

    if (Object.values(controls).some((c) => c === true)) {
      if (controls.forward) {
        charRef.current.position.y += movementSpeed;
        if (charRef.current.material.map) {
          // console.log(clock.oldTime - clock.elapsedTime);
          if (timeRef.current > 160 * 9) {
            charRef.current.material.map.offset.x =
              [2, 3, 4, 5][posRef.current % 4] / 6;
            charRef.current.material.map.offset.y = 2 / 4;
            timeRef.current = 0;
            console.log('elapsed', posRef.current % 2);
            posRef.current += 1;
          } else {
            timeRef.current += 160;
          }
        }
      }
      if (controls.backward) {
        charRef.current.position.y -= movementSpeed;
        if (charRef.current.material.map) {
          if (timeRef.current > 160 * 9) {
            charRef.current.material.map.offset.x =
              [2, 3, 4, 5][posRef.current % 4] / 6;
            charRef.current.material.map.offset.y = 3 / 4;
            timeRef.current = 0;
            console.log('elapsed', posRef.current % 2);
            posRef.current += 1;
          } else {
            timeRef.current += 160;
          }
        }
      }
      if (controls.right) {
        charRef.current.position.x += movementSpeed;
        if (charRef.current.material.map) {
          if (timeRef.current > 160 * 7) {
            charRef.current.material.map.offset.x =
              [1, 2, 3, 4, 5][posRef.current % 5] / 6;
            charRef.current.material.map.offset.y = 0 / 4;
            timeRef.current = 0;
            console.log('elapsed', posRef.current % 2);
            posRef.current += 1;
          } else {
            timeRef.current += 160;
          }
        }
      }
      if (controls.left) {
        charRef.current.position.x -= movementSpeed;
        if (charRef.current.material.map) {
          if (timeRef.current > 160 * 7) {
            charRef.current.material.map.offset.x =
              [1, 2, 3, 4, 5][posRef.current % 5] / 6;
            charRef.current.material.map.offset.y = 1 / 4;
            timeRef.current = 0;
            console.log('elapsed', posRef.current % 2);
            posRef.current += 1;
          } else {
            timeRef.current += 160;
          }
        }
      }
      if (controls.p_letter && flag.current) {
        // TODO: this is ugly please fix it
        flag.current = false;
        setToggleStore(false);
        setToggleMenu(!toggleMenu);
        (async () => {
          await setTimeout(() => {
            flag.current = true;
          }, 100);
        })().catch(console.error);
      }
      if (controls.l_letter && flag.current) {
        // TODO: this is ugly please fix it
        flag.current = false;
        setToggleMenu(false);
        setToggleStore(!toggleStore);
        (async () => {
          await setTimeout(() => {
            flag.current = true;
          }, 100);
        })().catch(console.error);
      }
    }
  });

  if (encounter) {
    return (
      <Html fullscreen>
        <gameStateContext.Provider value={partyContextValue}>
          <Battle encounter={encounter} setEncounter={setEncounter} />
        </gameStateContext.Provider>
      </Html>
    );
  }

  return (
    <>
      <MainCharacter
        charRef={charRef}
        lastPosition={lastPosition}
        isCharacterFreezed={isCharacterFreezed}
      />
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
            <Store toggleStore={toggleStore} />
            <Menu toggleMenu={toggleMenu} />
            <Prompt
              promptDialog={promptDialog}
              setPromptDialog={setPromptDialog}
              setIsCharacterFreezed={setIsCharacterFreezed}
            />
          </div>
        </gameStateContext.Provider>
      </Html>
    </>
  );
}
