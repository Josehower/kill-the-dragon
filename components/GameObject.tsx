import { css } from '@emotion/react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import * as three from 'three';
import { Encounter, gameEncounters } from '../database/encounters';
import { GameItem, GameWeapon } from '../database/inventory';
import { Ally, playerParty } from '../database/party';
import { BaseFloor } from '../structures/BaseFloor';
import { MainCharacter } from '../structures/MainCharacter';
import Battle from './Battle';
import BattleControl from './BattleControl';
import Menu from './Menu';
import Store from './Store';

// function Box(props: MeshProps) {
//   // This reference gives us direct access to the THREE.Mesh object
//   const ref = useRef<MeshProps>();
//   // Hold state for hovered and clicked events
//   const [hovered, hover] = useState(false);
//   const [clicked, click] = useState(false);
//   // Subscribe this component to the render-loop, rotate the mesh every frame
//   useFrame(() => {
//     if (ref.current) ref.current.rotation.x += 0.01;
//   });
//   // Return the view, these are regular Threejs elements expressed in JSX
//   return (
//     <mesh
//       {...props}
//       ref={ref}
//       scale={clicked ? 1.5 : 1}
//       onClick={event => click(!clicked)}
//       onPointerOver={event => hover(true)}
//       onPointerOut={event => hover(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//     </mesh>
//   );
// }

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
    // console.log(charRef.current.position.y, charRef.current.position.x);

    if (
      Math.round(charRef.current.position.y) === 2 &&
      Math.round(charRef.current.position.x) === -5
    ) {
      console.log('combat');
      setEncounter(gameEncounters[1]);
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
      <BaseFloor />
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

            <h2>Go to Combat</h2>
            <BattleControl encounter={encounter} setEncounter={setEncounter} />
          </div>
        </gameStateContext.Provider>
      </Html>
    </>
  );
}
