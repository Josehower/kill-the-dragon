import { css } from '@emotion/react';
import { Dispatch, SetStateAction } from 'react';
import { Encounter, gameEncounters } from '../database/encounters';

export type Props = {
  encounter: Encounter | null;
  setEncounter: Dispatch<SetStateAction<Encounter | null>>;
};

export default function BattleControl({ encounter, setEncounter }: Props) {
  function clickHandler(id: number) {
    const gameEncounter = gameEncounters.find(
      combatObj => combatObj.id === id
    ) as Encounter;
    setEncounter(gameEncounter);
  }

  return (
    <div>
      <button
        css={css`
          cursor: pointer;
        `}
        onClick={() => {
          clickHandler(1);
        }}
      >
        easy
      </button>
      <button
        css={css`
          cursor: pointer;
        `}
        onClick={() => {
          clickHandler(2);
        }}
      >
        medium
      </button>
      <button
        css={css`
          cursor: pointer;
        `}
        onClick={() => {
          clickHandler(3);
        }}
      >
        Dragon
      </button>
    </div>
  );
}
