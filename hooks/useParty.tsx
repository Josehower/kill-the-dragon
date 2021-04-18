import { useContext } from 'react';
import { partyContext, PartyContextType } from '../pages/_app';

export default function useParty() {
  return useContext(partyContext) as PartyContextType;
}
