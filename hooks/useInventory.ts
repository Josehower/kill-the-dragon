import { Dispatch, SetStateAction, useContext } from 'react';
import { partyContext, PartyContextType, PlayerInventory } from '../pages/html';

export default function useInventory() {
  const { partyInventory, setPartyInventory } = useContext(
    partyContext
  ) as PartyContextType;
  return [partyInventory, setPartyInventory] as [
    PlayerInventory,
    Dispatch<SetStateAction<PlayerInventory>>
  ];
}
