import { css } from '@emotion/react';
import { Dispatch, SetStateAction } from 'react';
import { GameItem, gameItems, GameWeapon } from '../database/inventory';
import useInventory from '../hooks/useInventory';

export default function Store({
  toggleStore,
  setToggleStore,
}: {
  toggleStore: boolean;
  setToggleStore: Dispatch<SetStateAction<boolean>>;
}) {
  const [inventory, setInventory] = useInventory();

  return (
    <>
      {toggleStore && (
        <button
          onClick={() => {
            setToggleStore(false);
          }}
        >
          Close
        </button>
      )}

      {toggleStore && (
        <div>
          <h1>Store: </h1>
          {Object.entries(gameItems).map(([item, object]) => {
            return (
              <div
                key={`store-item-${item}-${object.id}`}
                css={css`
                  display: flex;
                  align-items: center;
                  gap: 10px;
                `}
              >
                <div
                  css={css`
                    width: 200px;
                  `}
                >
                  <hr />
                  <br />
                  {item}: ${object.price}
                  <br />
                  <br />
                </div>
                <button
                  key={object.id}
                  onClick={() => {
                    if (inventory.gold < object.price) {
                      console.log('ups no money');
                      return;
                    }

                    setInventory((old) => {
                      const gold = old.gold - object.price;
                      const gameItem = object.isWeapon
                        ? []
                        : [{ item: object as GameItem, qty: 1 }];
                      const weapon = object.isWeapon
                        ? [{ weapon: object as GameWeapon, qty: 1 }]
                        : [];
                      return {
                        gold: gold,
                        items: [...old.items, ...gameItem].reduce(
                          (acc, current) => {
                            const currentFirstInstance = acc.find(
                              (obj) => current.item.id === obj.item.id,
                            );

                            if (currentFirstInstance) {
                              currentFirstInstance.qty += current.qty;
                              return [...acc];
                            }

                            return [...acc, current];
                          },
                          [] as { item: GameItem; qty: number }[],
                        ),
                        weapons: [...old.weapons, ...weapon].reduce(
                          (acc, current) => {
                            const currentFirstInstance = acc.find(
                              (obj) => current.weapon.id === obj.weapon.id,
                            );

                            if (currentFirstInstance) {
                              currentFirstInstance.qty += current.qty;
                              return [...acc];
                            }

                            return [...acc, current];
                          },
                          [] as { weapon: GameWeapon; qty: number }[],
                        ),
                      };
                    });
                  }}
                >
                  Buy
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
