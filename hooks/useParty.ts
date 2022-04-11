import { Dispatch, SetStateAction, useContext } from 'react';
import {
  gameStateContext,
  GameStateContext,
} from '../components/structures/DomBasedComponent';
import { Ally } from '../database/party';

export default function useParty() {
  const { party, setParty } = useContext(gameStateContext) as GameStateContext;
  return [party, setParty] as [Ally[], Dispatch<SetStateAction<Ally[]>>];
}
