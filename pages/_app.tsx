import { css, Global } from '@emotion/react';
import { AppProps } from 'next/app';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { Ally, playerParty } from '../database/party';

export type PartyContextType = {
  party: Ally[];
  setParty: Dispatch<SetStateAction<Ally[]>>;
};

export const partyContext = createContext<PartyContextType | null>(null);

function App({ Component, pageProps }: AppProps) {
  const [party, setParty] = useState(() => playerParty);

  const partyContextValue: PartyContextType = {
    party,
    setParty,
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
