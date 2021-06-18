/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import Battle from '../components/Battle';
import { Encounter, gameEncounters } from '../database/encounters';
import { GameItem, gameItems, GameWeapon } from '../database/inventory';
import useInventory from '../hooks/useInventory';
import useParty from '../hooks/useParty';

export default function Home() {
  const [encounter, setEncounter] = useState<undefined | Encounter>();
  const [party, setParty] = useParty();
  const [inventory, setInventory] = useInventory();
  console.log(inventory);

  function clickHandler(id: number) {
    const gameEncounter = gameEncounters.find(combatObj => combatObj.id === id);
    setEncounter(gameEncounter);
  }

  if (!encounter) {
    return (
      <>
        <div>
          <span>--- GOLD: {inventory.gold} ---</span>
          <span>
            --- ITEMS:
            {inventory.items.map(
              itemObj => ` ${itemObj.item.name}: ${itemObj.qty}  `
            )}
            ---
          </span>
          <span>
            --- WEAPONS:{' '}
            {inventory.weapons.map(
              itemObj => ` ${itemObj.weapon.name}: ${itemObj.qty}  `
            )}
          </span>
          <hr />
          <hr />
          {Object.entries(gameItems).map(([item, object]) => (
            <button
              key={object.id}
              onClick={() =>
                setInventory(old => {
                  const item = object.isWeapon
                    ? []
                    : [{ item: object as GameItem, qty: 1 }];
                  const weapon = object.isWeapon
                    ? [{ weapon: object as GameWeapon, qty: 1 }]
                    : [];
                  return {
                    ...old,
                    items: [...old.items, ...item].reduce((acc, current) => {
                      const currentFirstInstance = acc.find(
                        obj => current.item.id === obj.item.id
                      );

                      if (currentFirstInstance) {
                        currentFirstInstance.qty += current.qty;
                        return [...acc];
                      }

                      return [...acc, current];
                    }, [] as { item: GameItem; qty: number }[]),
                    weapons: [...old.weapons, ...weapon].reduce(
                      (acc, current) => {
                        const currentFirstInstance = acc.find(
                          obj => current.weapon.id === obj.weapon.id
                        );

                        if (currentFirstInstance) {
                          currentFirstInstance.qty += current.qty;
                          return [...acc];
                        }

                        return [...acc, current];
                      },
                      [] as { weapon: GameWeapon; qty: number }[]
                    ),
                  };
                })
              }
            >
              Add {item}
            </button>
          ))}
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
