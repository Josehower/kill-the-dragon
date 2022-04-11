import { Dispatch, SetStateAction, useContext } from 'react';
import {
  gameStateContext,
  GameStateContext,
  PlayerInventory,
} from '../components/structures/DomBasedComponent';

export default function useInventory() {
  const { partyInventory, setPartyInventory } = useContext(
    gameStateContext,
  ) as GameStateContext;
  return [partyInventory, setPartyInventory] as [
    PlayerInventory,
    Dispatch<SetStateAction<PlayerInventory>>,
  ];
}
