/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import Battle from '../components/Battle';
import { Encounter, gameEncounters } from '../database/encounters';
import useInventory from '../hooks/useInventory';
import useParty from '../hooks/useParty';

export default function Home() {
  const [encounter, setEncounter] = useState<undefined | Encounter>();
  const [party, setParty] = useParty();
  const [inventory] = useInventory();

  function clickHandler(id: number) {
    const gameEncounter = gameEncounters.find(combatObj => combatObj.id === id);
    setEncounter(gameEncounter);
  }

  if (!encounter) {
    return (
      <>
        <div>
          <span>--- GOLD: {inventory.gold} ---</span>
          <span>--- ITEMS: {JSON.stringify(inventory.items)} ---</span>
          <span>--- WEAPONS: {JSON.stringify(inventory.weapons)}</span>
          <div
            css={css`
              display: flex;
              gap: 5vw;
            `}
          >
            {party.map(ally => {
              return (
                <div key={ally.id}>
                  <h2> {ally.name}</h2>
                  <h3>{ally.currentHp}</h3>
                  <ul>
                    <li>exp:{ally.exp}</li>
                    {Object.entries(ally.stats).map(stat => (
                      <li key={`stat-${stat[0]}`}>
                        {stat[0]}: {JSON.stringify(stat[1])}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      if (ally.stats.isDead) return;
                      setParty(old =>
                        old.map(char => {
                          if (char.id === ally.id) {
                            return {
                              ...ally,
                              currentHp: ally.stats.hp,
                            };
                          }
                          return char;
                        })
                      );
                    }}
                  >
                    heal
                  </button>
                  <button
                    onClick={() => {
                      if (!ally.stats.isDead) return;
                      setParty(old =>
                        old.map(char => {
                          if (char.id === ally.id) {
                            return {
                              ...ally,
                              currentHp: ally.stats.hp / 2,
                              stats: { ...ally.stats, isDead: false },
                            };
                          }
                          return char;
                        })
                      );
                    }}
                  >
                    Revive
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <hr />
        <hr />
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

  return <Battle encounter={encounter} setEncounter={setEncounter} />;
}
