import { css } from '@emotion/react';
import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import BattleControl from '../components/BattleControl';
import Menu from '../components/Menu';
import Store from '../components/Store';
import { GameItem, GameWeapon } from '../database/inventory';
import { Ally, playerParty } from '../database/party';

const canvas = css`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

export type PlayerInventory = {
  gold: number;
  items: { item: GameItem; qty: number }[];
  weapons: { weapon: GameWeapon; qty: number }[];
};

export type PartyContextType = {
  party: Ally[];
  setParty: Dispatch<SetStateAction<Ally[]>>;
  partyInventory: PlayerInventory;
  setPartyInventory: Dispatch<SetStateAction<PlayerInventory>>;
};

export const partyContext = createContext<PartyContextType | null>(null);

function GuiComponent() {
  const [party, setParty] = useState<Ally[]>(() => playerParty);
  const [partyInventory, setPartyInventory] = useState<PlayerInventory>({
    gold: 0,
    items: [],
    weapons: [],
  });

  const partyContextValue: PartyContextType = {
    party,
    setParty,
    partyInventory,
    setPartyInventory,
  };

  return (
    <>
      <Html fullscreen>
        <partyContext.Provider value={partyContextValue}>
          <h2>Menu</h2>
          <Store />
          <Menu />

          <h2>Go to Combat</h2>
          <BattleControl />
        </partyContext.Provider>
      </Html>
    </>
  );
}

export default function Refactor() {
  console.log('canvas render');
  return (
    <div css={canvas}>
      <Canvas
        camera={{
          position: [0, 0, 32],
          zoom: 90,
          near: 0.1,
          far: 64,
        }}
        orthographic
        gl={{ alpha: false, antialias: false }}
      >
        <GuiComponent />

        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
      </Canvas>
    </div>
  );
}
