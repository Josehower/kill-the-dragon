/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { klona } from 'klona';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CombatAction } from '../database/actions';
import { Encounter } from '../database/encounters';
import { Enemy } from '../database/enemies';
import { Ally } from '../database/party';
import useCombatLoop from '../hooks/useCombatLoop';
import useEnemyTeam from '../hooks/useEnemyTeam';
import useInventory from '../hooks/useInventory';
import useParty from '../hooks/useParty';
import { calculateHealthDelta, getCombatAction } from '../utils/combat';
import { getRandomFromArray } from '../utils/miscelaneous';
import { wait } from '../utils/wait';
import ActiveBar from './ActiveBar';
import ProgressBar from './ProgressBar';

type ActionCountObj = {
  id: number;
  speed: number;
  count: number;
  isActive: boolean;
};

export type CountContextType = {
  partyActionCount: ActionCountObj[];
  enemiesActionCount: ActionCountObj[];
};

export const battleContext = createContext<CountContextType | null>(null);

export default function Battle({
  encounter,
  setEncounter,
}: {
  encounter: Encounter;
  setEncounter: Dispatch<SetStateAction<Encounter | undefined>>;
}) {
  const isActionRunning = useRef(false);
  const endOfCombat = useRef(false);
  const inventory = useInventory();

  const [isPartyFleeing, setIsPartyFleeing] = useState<boolean>(false);

  // Actions Queue that manage game turn system
  const [actionArray, setActionArray] = useState<
    { action: CombatAction; performer: Ally | Enemy; foe: Ally | Enemy }[]
  >([]);

  // party Id Queue that manage players Input interface
  const [allyIdQueue, setAllyIdQueue] = useState<number[]>([]);
  const [selectedAction, setSelectedAction] = useState<
    | {
        action: CombatAction;
        performer: Ally | Enemy;
      }
    | null
    | 'item'
  >(null);

  // HP management variables
  const [party, setParty] = useParty(); // Uses the global party state. info should be persisted even out of encounter.
  const [enemyTeam, setEnemyTeam] = useEnemyTeam(encounter.enemyTeam); // Uses an instance of the encounter enemy team as state.

  // Action management variables
  const partyActionCount = useRef<ActionCountObj[]>(
    party.map(ally => {
      return {
        id: ally.id,
        speed: ally.stats.speed,
        count: 0,
        isActive: false,
      };
    })
  );

  const enemiesActionCount = useRef<ActionCountObj[]>(
    enemyTeam.map(enemy => {
      return {
        id: enemy.id,
        speed: enemy.stats.speed,
        count: 0,
        isActive: false,
      };
    })
  );
  const battleCountContext = {
    partyActionCount: partyActionCount.current,
    enemiesActionCount: enemiesActionCount.current,
  };

  function enemyEscape(enemy: Enemy) {
    const actionObjIndex = enemiesActionCount.current.findIndex(
      obj => obj.id === enemy.id
    );
    if (actionObjIndex > -1) {
      enemiesActionCount.current[actionObjIndex].count = 0;
      enemiesActionCount.current[actionObjIndex].isActive = false;
      enemiesActionCount.current.splice(actionObjIndex, 1);
      setActionArray(oldArray =>
        oldArray.filter((_, index) => {
          return index !== 0;
        })
      );
      setEnemyTeam(
        enemyTeam.filter(opp =>
          enemiesActionCount.current.some(obj => obj.id === opp.id)
        )
      );
      killCharacter(enemy);
    }
  }

  function killCharacter(char: Enemy | Ally) {
    char.currentHp = 0;
    char.stats.isDead = true;

    if (char.isAlly) {
      const countObj = partyActionCount.current.find(
        allyCount => allyCount.id === char.id
      );
      if (countObj) {
        countObj.isActive = false;
      }
      if (char.id === allyIdQueue[0] && selectedAction === 'item') {
        setSelectedAction(null);
      }
      setAllyIdQueue(idArray => idArray.filter(id => id !== char.id));
      if (
        selectedAction !== 'item' &&
        selectedAction?.performer.id === char.id
      ) {
        setSelectedAction(null);
      }
    } else {
      const countObj = enemiesActionCount.current.find(
        enemyCount => enemyCount.id === char.id
      );
      if (countObj) {
        countObj.isActive = false;
      }
    }
  }

  // This use Effect manage the turn based system performing one action at the time
  useEffect(() => {
    if (!isActionRunning.current && actionArray[0]) {
      const { action, performer, foe } = actionArray[0];
      performAction(action, performer, foe);
      // console.log('action', actionArray[0]?.performer?.name);
    }
  }, [actionArray]);

  function concedeRewards() {
    console.log('rewards granted');
  }

  async function performAction(
    action: CombatAction,
    performer: Ally | Enemy,
    foe: Ally | Enemy
  ) {
    isActionRunning.current = true;

    await wait(2000);

    if (action.isFlee) {
      isActionRunning.current = false;
      if (performer.isAlly) {
        setIsPartyFleeing(true);
      } else {
        enemyEscape(performer as Enemy);
      }
      return;
    }

    const healthDelta = calculateHealthDelta(
      action,
      performer.stats,
      foe.stats,
      performer.weapon
    );

    if (healthDelta.hpDelta > 0 && !healthDelta.isHealed) {
      healthDelta.hpDelta = 0;
    }
    let newTeam: Array<Ally | Enemy>;

    if (foe.isAlly) {
      newTeam = klona(party);
    } else {
      newTeam = klona(enemyTeam);
    }

    const foeCopy = newTeam.find(character => character.id === foe.id);

    if (foeCopy) {
      foeCopy.currentHp += healthDelta.hpDelta;
      if (foeCopy.currentHp <= 0) {
        killCharacter(foeCopy);
      } else {
        foeCopy.stats.isDead = false;
      }
      if (foeCopy.currentHp > foe.stats.hp) {
        foeCopy.currentHp = foe.stats.hp;
      }

      foe.isAlly
        ? setParty(newTeam as Ally[])
        : setEnemyTeam(newTeam as Enemy[]);
    }
    const countObjRef = performer.isAlly
      ? partyActionCount.current.find(countObj => countObj.id === performer.id)
      : enemiesActionCount.current.find(
          countObj => countObj.id === performer.id
        );

    isActionRunning.current = false;
    setActionArray(oldArray =>
      oldArray.filter((action, index) => {
        if (foeCopy?.stats.isDead && action.performer.id === foeCopy.id) {
          return false;
        } else {
          return index !== 0;
        }
      })
    );

    if (countObjRef) {
      countObjRef.isActive = false;
      countObjRef.count = 0;
    }
  }

  useCombatLoop((a: number, b: number, c: { current: any }) => {
    //console.log('1');
    const gameSpeed = 2;

    // avoid start the loop too early
    if (endOfCombat.current) return;
    // if (reRender === undefined) {
    //   setReRender(true);
    //   return 'battle render';
    // }

    // stop loop if game is finished
    if (
      party.every(ally => ally.stats.isDead) ||
      enemyTeam.every(enemy => enemy.stats.isDead)
    ) {
      return 'dead';
    }

    // add ally id to action queue if count is 10000
    partyActionCount.current.forEach(ally => {
      const allyObjRef = party.find(char => ally.id === char.id);
      if (ally.count > 10000) {
        ally.isActive = true;
        setAllyIdQueue(oldQueue => [...oldQueue, ally.id]);
        ally.count = 0;
      }
      // update ally action count

      if (allyObjRef && !allyObjRef.stats.isDead && !ally.isActive) {
        // console.log('a', a, 'speed', a % 10500);
        ally.count += b * gameSpeed * ally.speed;
      }
      if (allyObjRef?.stats.isDead) ally.count = 0;
    });

    // add enemy id to action queue if count is 10000
    enemiesActionCount.current.forEach(enemy => {
      const enemyObjRef = enemyTeam.find(char => enemy.id === char.id);

      if (enemy.count > 10000) {
        const enemyRef = enemyTeam.find(opponent => {
          return opponent.id === enemy.id;
        }) as Enemy;
        if (enemyRef) {
          const action = getCombatAction(enemyRef);
          let foe = getRandomFromArray(
            party.filter(ally => ally.currentHp > 0)
          );
          if (action.isFriendly) {
            foe = getRandomFromArray(enemyTeam);
          }

          setActionArray(oldArray => [
            ...oldArray,
            { action, performer: enemyRef, foe },
          ]);
          enemy.isActive = true;
        }

        enemy.count = 0;
      }
      // update enemy action count
      if (enemyObjRef && !enemyObjRef.stats.isDead && !enemy.isActive) {
        // console.log('up', enemy.count + 1 * enemy.speed);
        enemy.count += b * gameSpeed * enemy.speed;
      }
      if (enemyObjRef?.stats.isDead) enemy.count = 0;
    });
    return 'battle';
  });

  // render if combat is over
  if (isPartyFleeing) {
    return (
      <div>
        <h1> you are the coward</h1>
        <button onClick={() => setEncounter(undefined)}>main</button>
      </div>
    );
  }
  if (party.every(ally => ally.stats.isDead)) {
    return (
      <div>
        <h1>game over</h1>
        <button onClick={() => window.location.reload()}>restart</button>
      </div>
    );
  }
  if (enemyTeam.every(enemy => enemy.stats.isDead)) {
    let rewards;
    if (endOfCombat.current === false) {
      rewards = concedeRewards();
      endOfCombat.current = true;
    }

    return (
      <div>
        <h1> you win</h1>
        {JSON.stringify(rewards)}
        <button onClick={() => setEncounter(undefined)}>main</button>
      </div>
    );
  }

  // render if combat is on
  return (
    <>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          justify-content: space-around;
          align-items: center;
          gap: 10px;
          margin: 0 auto;
          width: 60vw;
        `}
      >
        <div>
          {enemyTeam.map(enemy => {
            return (
              <div
                key={enemy.id}
                css={css`
                  ${actionArray.some(
                    actionObj => actionObj.performer.id === enemy.id
                  )
                    ? 'background-color: green'
                    : ''};
                  ${actionArray[0]?.performer.id === enemy.id
                    ? 'background-color: red'
                    : ''};
                  ${enemy.stats.isDead ? 'background-color: #505050' : ''};
                  ${actionArray[0]?.foe.id === enemy.id
                    ? 'background-color: #51d6ee'
                    : ''};
                `}
              >
                <div>{enemy.name}</div>
                <div>{enemy.currentHp}</div>
                <ProgressBar
                  current={enemy.currentHp}
                  max={enemy.stats.hp}
                  barName={'HP'}
                />
                <battleContext.Provider value={battleCountContext}>
                  <ActiveBar id={enemy.id} max={10000} />
                </battleContext.Provider>
              </div>
            );
          })}
        </div>
        <div
          css={css`
            display: grid;
            grid-template-rows: 1fr 1fr;
          `}
        >
          {party.map(ally => (
            <div
              key={ally.id}
              css={css`
                ${actionArray.some(
                  actionObj => actionObj.performer.id === ally.id
                )
                  ? 'background-color: green'
                  : ''};
                ${actionArray[0]?.performer.id === ally.id
                  ? 'background-color: red'
                  : ''};
                ${ally.stats.isDead ? 'background-color: #575757' : ''};
                ${actionArray[0]?.foe.id === ally.id
                  ? 'background-color: #51d6ee'
                  : ''};
              `}
            >
              <div>{ally.name}</div>
              <div>{ally.currentHp}</div>
              <ProgressBar
                current={ally.currentHp}
                max={ally.stats.hp}
                barName={'HP'}
              />
              <battleContext.Provider value={battleCountContext}>
                <ActiveBar id={ally.id} max={10000} isAlly={true} />
              </battleContext.Provider>
              <div>
                <>
                  {!selectedAction && inventory[0].items.length > 0 && (
                    <button
                      css={css`
                        height: 20px;
                        ${allyIdQueue[0] === ally.id
                          ? 'display: auto'
                          : 'display: none'};
                        ${ally.stats.isDead
                          ? 'display: none'
                          : 'display: auto'};
                      `}
                      onClick={() => {
                        setSelectedAction('item');
                      }}
                    >
                      item
                    </button>
                  )}
                  {!selectedAction &&
                    ally.actions
                      // .filter(action => !action.fromItem)
                      .map(action => {
                        return (
                          <button
                            key={action.id}
                            onClick={() => {
                              if (!action.isFlee) {
                                setSelectedAction({ action, performer: ally });
                              } else {
                                setActionArray(oldArray => [
                                  ...oldArray,
                                  { action, performer: ally, foe: ally },
                                ]);
                                setAllyIdQueue(oldQueue =>
                                  oldQueue.filter((_, index) => index !== 0)
                                );
                              }
                            }}
                            css={css`
                              height: 20px;
                              ${allyIdQueue[0] === ally.id
                                ? 'display: auto'
                                : 'display: none'};
                              ${ally.stats.isDead
                                ? 'display: none'
                                : 'display: auto'};
                            `}
                          >
                            {action.name}
                          </button>
                        );
                      })}
                </>
                {selectedAction === 'item' &&
                  inventory[0].items.map(({ item, qty }) => {
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          const action = item.useItem(inventory);
                          if (!action) return;
                          setSelectedAction({ action, performer: ally });
                        }}
                        css={css`
                          height: 20px;
                          ${allyIdQueue[0] === ally.id
                            ? 'display: auto'
                            : 'display: none'};
                          ${ally.stats.isDead
                            ? 'display: none'
                            : 'display: auto'};
                        `}
                      >
                        {item.name} x{qty}
                      </button>
                    );
                  })}
                {selectedAction !== 'item' &&
                  selectedAction &&
                  !selectedAction.action.isFriendly &&
                  enemyTeam
                    .filter(enemy => !enemy.stats.isDead)
                    .map(enemy => (
                      <button
                        key={enemy.id}
                        onClick={() => {
                          setActionArray(oldArray => [
                            ...oldArray,
                            { ...selectedAction, foe: enemy },
                          ]);
                          setAllyIdQueue(oldQueue =>
                            oldQueue.filter((_, index) => index !== 0)
                          );
                          setSelectedAction(null);
                        }}
                        css={css`
                          height: 20px;
                          ${allyIdQueue[0] === ally.id
                            ? 'display: auto'
                            : 'display: none'};
                          ${ally.stats.isDead
                            ? 'display: none'
                            : 'display: auto'};
                        `}
                      >
                        {enemy.name}
                      </button>
                    ))}
                {selectedAction !== 'item' &&
                  selectedAction?.action.isFriendly &&
                  party.map(foeAlly => (
                    <button
                      key={foeAlly.id}
                      onClick={() => {
                        setActionArray(oldArray => [
                          ...oldArray,
                          { ...selectedAction, foe: foeAlly },
                        ]);
                        setAllyIdQueue(oldQueue =>
                          oldQueue.filter((_, index) => index !== 0)
                        );
                        setSelectedAction(null);
                      }}
                      css={css`
                        height: 20px;
                        ${allyIdQueue[0] === ally.id
                          ? 'display: auto'
                          : 'display: none'};
                        ${ally.stats.isDead
                          ? 'display: none'
                          : 'display: auto'};
                      `}
                    >
                      {foeAlly.name}
                    </button>
                  ))}
                {selectedAction && (
                  <button
                    onClick={() => setSelectedAction(null)}
                    css={css`
                      height: 20px;
                      ${allyIdQueue[0] === ally.id
                        ? 'display: auto'
                        : 'display: none'};
                      ${ally.stats.isDead ? 'display: none' : 'display: auto'};
                    `}
                  >
                    back
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <ul
          css={css`
            display: block;
          `}
        >
          {actionArray.map(action => {
            return (
              <li key={action.performer.id}>
                {action.performer.name} || {action.action.name} {'===>'}
                {action.foe.name}
              </li>
            );
          })}
        </ul>
      </div>
      {/* {JSON.stringify(selectedAction)}
      {JSON.stringify(party)}
      {JSON.stringify(partyActionCount)} */}
    </>
  );
}
