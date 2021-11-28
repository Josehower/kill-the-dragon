import { css } from '@emotion/react';
import { useState } from 'react';
import Battle from '../components/Battle';
import { Encounter, gameEncounters } from '../database/encounters';

export default function BattleControl() {
  const [encounter, setEncounter] = useState<Encounter | null>(null);

  function clickHandler(id: number) {
    const gameEncounter = gameEncounters.find(
      combatObj => combatObj.id === id
    ) as Encounter;
    setEncounter(gameEncounter);
  }

  if (encounter) {
    return <Battle encounter={encounter} setEncounter={setEncounter} />;
  } else {
    return (
      <div>
        <button
          css={css`
            cursor: pointer;
          `}
          onClick={() => {
            console.log('ckic');
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
}
