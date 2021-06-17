import { css, Global } from '@emotion/react';
import { AppProps } from 'next/app';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { GameItem, GameWeapon } from '../database/inventory';
import { Ally, playerParty } from '../database/party';

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
            min-height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen;
            /* background: papayawhip; */
            /* font-family: Helvetica, Arial, sans-serif; */
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
