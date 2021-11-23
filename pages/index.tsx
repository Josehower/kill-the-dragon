import { useState } from 'react';
import Battle from '../components/Battle';
import Menu from '../components/Menu';
import Store from '../components/Store';
import { Encounter, gameEncounters } from '../database/encounters';

export default function Home() {
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
      <>
        <hr />
        <hr />
        <h2>Menu</h2>
        <Store />
        <Menu />

        <h2>Go to Combat</h2>
        <button
          onClick={() => {
            clickHandler(1);
          }}
        >
          easy
        </button>
        <button
          onClick={() => {
            clickHandler(2);
          }}
        >
          medium
        </button>
        <button
          onClick={() => {
            clickHandler(3);
          }}
        >
          Dragon
        </button>
      </>
    );
  }
}
