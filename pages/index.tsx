import { useState } from 'react';
import Battle from '../components/Battle';
import { Encounter, gameEncounters } from '../database/encounters';

export default function Home() {
  const [encounter, setEncounter] = useState<undefined | Encounter>();

  function clickHandler(id: number) {
    const gameEncounter = gameEncounters.find(combatObj => combatObj.id === id);
    setEncounter(gameEncounter);
  }

  if (!encounter) {
    // clickHandler(2);

    return (
      <>
        <button
          onClick={() => {
            clickHandler(1);
          }}
        >
          encounter 1
        </button>
        <button
          onClick={() => {
            clickHandler(2);
          }}
        >
          encounter 2
        </button>
        <button
          onClick={() => {
            clickHandler(3);
          }}
        >
          encounter 3
        </button>
      </>
    );
  }

  return <Battle encounter={encounter} />;
}
