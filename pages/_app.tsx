import { css, Global } from '@emotion/react';
import { Canvas } from '@react-three/fiber';
import { AppProps } from 'next/app';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { GameItem, GameWeapon } from '../database/inventory';
import { Ally, playerParty } from '../database/party';

const canvas = css`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
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

function App({ Component, pageProps }: AppProps) {
  const [party, setParty] = useState<Ally[]>(() => playerParty);
  const [partyInventory, setPartyInventory] = useState<PlayerInventory>({
    gold: 0,
    items: [],
    weapons: [],
  });

  console.log('ok', +Date.now());

  const partyContextValue: PartyContextType = {
    party,
    setParty,
    partyInventory,
    setPartyInventory,
  };

  return (
    <>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            color: white;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen;
          }
        `}
      />
      <partyContext.Provider value={partyContextValue}>
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
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
          </Canvas>
        </div>
        <Component {...pageProps} />
      </partyContext.Provider>
    </>
  );
}
export default App;
