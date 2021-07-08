/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import Battle from '../components/Battle';
import { Encounter, gameEncounters } from '../database/encounters';
import { GameItem, gameItems, GameWeapon } from '../database/inventory';
import useInventory from '../hooks/useInventory';
import useParty from '../hooks/useParty';
import { useItemOutOfCombat } from '../utils/gameMenuActions';

export default function Home() {
  const [encounter, setEncounter] = useState<undefined | Encounter>();
  const [party, setParty] = useParty();
  const gameInventory = useInventory();
  const [inventory, setInventory] = gameInventory;
  const weaponState = party.map(ally =>
    ally.weapon?.id ? `${ally.weapon?.id}` : ''
  );

  const equipedWeapon = weaponState
    .filter(wep => wep !== '')
    .reduce((acc: any[], current) => {
      const id = Number(current);
      let obj = acc.find(obj => obj.id === id);
      if (obj) {
        obj.qty += 1;
      } else {
        obj = { id: id, qty: 1 };
        acc.push(obj);
      }

      return acc;
    }, []);
  const restInv = inventory.weapons
    .map(obj => {
      const equiped = equipedWeapon.find(wep => wep.id === obj.weapon.id);
      let newObj;
      if (equiped) {
        newObj = { ...obj, qty: obj.qty - equiped.qty };
      }
      return newObj || obj;
    })
    .filter(obj => obj.qty !== 0);

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
              itemObj =>
                ` ${itemObj.weapon.name}: ${
                  restInv.find(obj => itemObj.weapon.id === obj.weapon.id)
                    ?.qty || 0
                }/${itemObj.qty}  `
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
            {party.map((ally, index) => {
              return (
                <div key={ally.id}>
                  <h2> {ally.name}</h2>
                  <h3>{ally.currentHp}</h3>
                  <h3>{ally.weapon?.name}</h3>
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
                      if (ally.currentHp === ally.stats.hp) return;
                      useItemOutOfCombat(
                        gameItems.potion,
                        ally,
                        setParty,
                        gameInventory
                      );
                    }}
                  >
                    heal
                  </button>
                  <button
                    onClick={() => {
                      if (!ally.stats.isDead) return;
                      useItemOutOfCombat(
                        gameItems.revive,
                        ally,
                        setParty,
                        gameInventory
                      );
                    }}
                  >
                    Revive
                  </button>
                  <select
                    value={weaponState[index]}
                    name='weapon'
                    onChange={e => {
                      const value = e.currentTarget.value;
                      setParty(current =>
                        current.map(currentAlly => {
                          if (currentAlly.id === ally.id) {
                            currentAlly.weapon =
                              (Object.values(gameItems).find(
                                wep => wep.id === Number(value)
                              ) as GameWeapon) || null;
                            return currentAlly;
                          }
                          return currentAlly;
                        })
                      );
                    }}
                  >
                    <option value=''>none</option>
                    {ally.weapon ? (
                      <option value={`${ally.weapon.id}`}>
                        {ally.weapon.name}
                      </option>
                    ) : (
                      ''
                    )}
                    {restInv.map(({ weapon }) => (
                      <option
                        key={`${weapon.id}-${ally.name}`}
                        value={`${weapon.id}`}
                      >
                        {weapon.name}
                      </option>
                    ))}
                  </select>
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
