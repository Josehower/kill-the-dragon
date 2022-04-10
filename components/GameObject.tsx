import { css } from '@emotion/react';
import { Html } from '@react-three/drei';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { GameDialog } from '../database/dialogs';
import { Encounter } from '../database/encounters';
import { GameItem, GameWeapon } from '../database/inventory';
import { Ally, playerParty } from '../database/party';
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

export default function GameObject() {
  console.log('render a');

  const [promptDialog, setPromptDialog] = useState<GameDialog>();
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
          <Store />
          <Menu />
          <Prompt
            promptDialog={promptDialog}
            setPromptDialog={setPromptDialog}
          />
        </div>
      </gameStateContext.Provider>
    </Html>
  );
}
