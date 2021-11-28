import { css, Global } from '@emotion/react';
import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AppProps } from 'next/app';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { GameItem, GameWeapon } from '../database/inventory';
import { Ally, playerParty } from '../database/party';

// const canvas = css`
//   width: 100vw;
//   height: 100vh;
//   position: absolute;
//   top: 0;
//   left: 0;
//   z-index: 0;
// `;

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
  // TODO: move this state outside of the canvas scope to avoid weird rerenders
  const [party, setParty] = useState<Ally[]>(() => playerParty);
  const [partyInventory, setPartyInventory] = useState<PlayerInventory>({
    gold: 0,
    items: [],
    weapons: [],
  });
  console.log('app render');

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
        <Component {...pageProps} />
      </partyContext.Provider>
    </>
  );
}
export default App;
