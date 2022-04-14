import { css } from '@emotion/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { gameItems, GameWeapon } from '../database/inventory';
import useInventory from '../hooks/useInventory';
import useParty from '../hooks/useParty';
import { activeItemOutOfCombat } from '../utils/gameMenuActions';
import ProgressBar from './progressBar';

const statsIcons: { [key: string]: string } = {
  lvl: `🎮`,
  hp: `💗`,
  pDmg: `👊`,
  mDmg: `💥`,
  dex: `🏇`,
  acc: `🎯`,
  pDef: `🛡`,
  mDef: `🔰`,
  speed: `🏃`,
  isDead: `💀`,
};

const playerBarStyle = css`
  background: rgba(16, 117, 128, 255);
  font-size: 20px;
  display: flex;
  gap: 50px;
  border: 2px solid rgba(43, 34, 27, 255);
  border-radius: 5px;
  justify-content: center;
  padding: 5px;
  width: 700px;
  color: rgb(245, 245, 229);
`;

const closeButtonStyle = css`
  background: transparent;
  border: none;
  border-radius: 50%;
  font-size: 1em;
  padding: 5px;

  :hover {
    transform: scale(1.2);
    cursor: pointer;
  }
`;

const toggleMenuStyle = css`
  background: rgba(16, 117, 128, 255);
  border: 2px solid rgba(43, 34, 27, 255);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 80vw;
  padding: 10px;
  color: rgb(245, 245, 229);
`;

const partyMemberBoxStyle = css`
  background: rgba(252, 53, 76, 255);
  padding: 12px;

  border: 2px solid rgba(43, 34, 27, 255);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  h2 {
    font-size: 1.2em;
  }

  ul {
    column-count: 2;
    column-gap: 20px;
    list-style-type: none;
    padding: 0;
    li {
      border: 2px solid rgba(43, 34, 27, 255);
      border-radius: 5px;
      margin-bottom: 5px;
      background-color: rgba(16, 117, 128, 255);
      padding: 2px;
    }
  }

  @media (max-width: 900px) {
    ul {
      display: none;
    }
  }
  @media (max-height: 700px) {
    ul {
      display: none;
    }
  } ;
`;

const imageDivStyle = css`
  background: rgba(11, 191, 188, 255);
  min-width: 15px;
  height: 5em;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid rgba(43, 34, 27, 255);
  overflow: hidden;
`;

export default function Menu({
  toggleMenu,
  setToggleMenu,
}: {
  toggleMenu: boolean;
  setToggleMenu: Dispatch<SetStateAction<boolean>>;
}) {
  const gameInventory = useInventory();
  const [inventory] = gameInventory;
  const [party, setParty] = useParty();
  const weaponState = party.map((ally) =>
    ally.weapon?.id ? ally.weapon.id : '',
  );

  useEffect(() => {
    // setInventory((inv) => {
    //   return { ...inv, gold: inv.gold + 100 };
    // });
    document.addEventListener('keydown', (e: globalThis.KeyboardEvent) => {
      if (e.code === 'KeyP') {
        setToggleMenu(!toggleMenu);
      }
    });

    return () => {
      document.removeEventListener('keydown', (e: globalThis.KeyboardEvent) => {
        if (e.code === 'KeyP') {
          setToggleMenu(!toggleMenu);
        }
      });
    };
  }, [setToggleMenu, toggleMenu]);

  const equippedWeapon = weaponState
    .filter((wep) => wep !== '')
    .reduce((acc: any[], current) => {
      const id = Number(current);
      let obj = acc.find((object) => object.id === id);
      if (obj) {
        obj.qty += 1;
      } else {
        obj = { id: id, qty: 1 };
        acc.push(obj);
      }

      return acc;
    }, []);

  const restInv = inventory.weapons
    .map((obj) => {
      const equipped = equippedWeapon.find((wep) => wep.id === obj.weapon.id);
      let newObj;
      if (equipped) {
        newObj = { ...obj, qty: obj.qty - equipped.qty };
      }
      return newObj || obj;
    })
    .filter((obj) => obj.qty !== 0);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        height: 100vh;
      `}
    >
      <div css={playerBarStyle}>
        <div>💰 : {inventory.gold} </div>
        <div>🧔🧙‍♀️🧙‍♂️🦹‍♀️: [ P ] </div>
        <div>
          {!inventory.items[0] && [`💞  : 0 `, `⚡  : 0`]}
          {inventory.items[0] &&
            !(inventory.items.length === 2) &&
            (inventory.items[0].item.id !== 1 ? [`💞   : 0 `] : [`⚡  : 0 `])}
          {inventory.items.map(
            (itemObj) =>
              `${itemObj.item.id === 1 ? `💞  ` : `⚡  `}: ${itemObj.qty}`,
          )}
        </div>
        <div>
          {!inventory.weapons[0] && [`📍  : 0 `, `🔪  : 0`]}
          {inventory.weapons[0] &&
            !(inventory.weapons.length === 2) &&
            (inventory.weapons[0].weapon.id !== 3
              ? [`📍  : 0 `]
              : [`🔪  : 0 `])}
          {inventory.weapons.map(
            (itemObj) =>
              ` ${itemObj.weapon.id === 3 ? `📍  ` : `🔪  `}: ${
                restInv.find((obj) => itemObj.weapon.id === obj.weapon.id)
                  ?.qty || 0
              }/${itemObj.qty}`,
          )}
        </div>
      </div>

      {toggleMenu && (
        <div css={toggleMenuStyle}>
          {party.map((ally, index) => {
            return (
              <div css={partyMemberBoxStyle} key={ally.id}>
                <h2> {ally.name}</h2>
                <h3>Exp:{ally.exp}</h3>
                <div css={imageDivStyle}>
                  <img src={ally.image} alt="ally pic" />
                </div>
                <h2>
                  Weapon:{' '}
                  {!ally.weapon ? ` 💪` : ally.weapon.id === 3 ? ` 📍` : ` 🔪`}
                </h2>

                <div>
                  <ProgressBar
                    completed={Math.round(
                      (ally.currentHp * 100) / ally.stats.hp,
                    )}
                    color="rgba(252, 53, 76, 255)"
                  />
                  HP: {ally.currentHp} / {ally.stats.hp}
                </div>

                <ul>
                  {Object.entries(ally.stats).map((stat) => (
                    <li key={`stat-${stat[0]}`}>
                      <span>
                        {statsIcons[stat[0]]}
                        {'  '}
                      </span>
                      : {'  '}
                      <span>{JSON.stringify(stat[1])}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (ally.stats.isDead) return;
                    if (ally.currentHp === ally.stats.hp) return;
                    activeItemOutOfCombat(
                      gameItems.potion,
                      ally,
                      setParty,
                      gameInventory,
                    );
                  }}
                >
                  heal
                </button>
                <button
                  onClick={() => {
                    if (!ally.stats.isDead) return;
                    activeItemOutOfCombat(
                      gameItems.revive,
                      ally,
                      setParty,
                      gameInventory,
                    );
                  }}
                >
                  Revive
                </button>
                <select
                  value={weaponState[index]}
                  name="weapon"
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setParty((current) =>
                      current.map((currentAlly) => {
                        if (currentAlly.id === ally.id) {
                          currentAlly.weapon = Object.values(gameItems).find(
                            (wep) => wep.id === Number(value),
                          ) as GameWeapon;
                          return currentAlly;
                        }
                        return currentAlly;
                      }),
                    );
                  }}
                >
                  <option value="">Fist</option>
                  {ally.weapon ? (
                    <option value={ally.weapon.id}>{ally.weapon.name}</option>
                  ) : (
                    ''
                  )}
                  {restInv.map(({ weapon }) => (
                    <option key={`${weapon.id}-${ally.name}`} value={weapon.id}>
                      {weapon.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
          <button
            css={closeButtonStyle}
            onClick={() => {
              setToggleMenu(false);
            }}
          >
            ❌
          </button>
        </div>
      )}
    </div>
  );
}
