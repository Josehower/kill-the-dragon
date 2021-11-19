import { Dispatch, SetStateAction, useContext } from 'react';
import { Ally } from '../database/party';
import { partyContext, PartyContextType } from '../pages/_app';

export default function useParty() {
  const { party, setParty } = useContext(partyContext) as PartyContextType;
  return [party, setParty] as [Ally[], Dispatch<SetStateAction<Ally[]>>];
}
