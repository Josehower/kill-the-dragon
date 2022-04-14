import { css } from '@emotion/react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { GameDialog } from '../../database/dialogs';
import { Encounter } from '../../database/encounters';
import { GameItem, GameWeapon } from '../../database/inventory';
import { Ally, playerParty } from '../../database/party';
import Battle from '../Battle';
import Menu from '../Menu';
import Prompt from '../Prompt';
import Store from '../Store';

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

export default function DomBasedComponent({
  encounterRef,
  promptDialogRef,
  toggleStoreRef,
  toggleMenuRef,
  isCharacterFreezed,
}: {
  encounterRef: MutableRefObject<Encounter | null>;
  promptDialogRef: MutableRefObject<GameDialog | null>;
  isCharacterFreezed: MutableRefObject<boolean>;
  toggleStoreRef: MutableRefObject<boolean>;
  toggleMenuRef: MutableRefObject<boolean>;
}) {
  const [party, setParty] = useState<Ally[]>(() => playerParty);
  const [partyInventory, setPartyInventory] = useState<PlayerInventory>({
    gold: 0,
    items: [],
    weapons: [],
  });

  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [promptDialog, setPromptDialog] = useState<GameDialog | null>(null);
  const [toggleStore, setToggleStore] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);

  const partyContextValue: GameStateContext = {
    party,
    setParty,
    partyInventory,
    setPartyInventory,
  };

  useEffect(() => {
    if (encounter) {
      encounterRef.current = encounter;
      isCharacterFreezed.current = true;
    } else {
      encounterRef.current = null;
      isCharacterFreezed.current = false;
    }
  }, [encounter, encounterRef, isCharacterFreezed]);

  useEffect(() => {
    if (promptDialog) {
      promptDialogRef.current = promptDialog;
      isCharacterFreezed.current = true;
    } else {
      promptDialogRef.current = null;
      isCharacterFreezed.current = false;
    }
  }, [promptDialog, promptDialogRef, isCharacterFreezed]);

  useEffect(() => {
    if (toggleStore !== toggleStoreRef.current) {
      toggleStoreRef.current = toggleStore;
    }
    if (toggleStore) {
      isCharacterFreezed.current = true;
    } else {
      isCharacterFreezed.current = false;
    }
  }, [toggleStore, toggleStoreRef, isCharacterFreezed]);

  useEffect(() => {
    if (toggleMenu !== toggleMenuRef.current) {
      toggleMenuRef.current = toggleMenu;
    }
    if (toggleMenu) {
      isCharacterFreezed.current = true;
    } else {
      isCharacterFreezed.current = false;
    }
  }, [toggleMenu, toggleMenuRef, isCharacterFreezed]);

  useFrame(() => {
    if (!encounter && encounterRef.current) {
      setEncounter(encounterRef.current);
    }
    if (!promptDialog && promptDialogRef.current) {
      setPromptDialog(promptDialogRef.current);
    }
    if (toggleStoreRef.current !== toggleStore) {
      setToggleStore(toggleStoreRef.current);
    }
    if (toggleMenuRef.current !== toggleMenu) {
      setToggleMenu(toggleMenuRef.current);
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
          <Prompt
            promptDialog={promptDialog}
            setPromptDialog={setPromptDialog}
          />
          <Menu toggleMenu={toggleMenu} setToggleMenu={setToggleMenu} />
          <Store toggleStore={toggleStore} setToggleStore={setToggleStore} />
        </div>
      </gameStateContext.Provider>
    </Html>
  );
}
