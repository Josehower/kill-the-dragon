/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { klona } from 'klona';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { CombatAction } from '../database/actions';
import { Encounter } from '../database/encounters';
import { Enemy } from '../database/enemies';
import { Ally } from '../database/party';
import useCombatLoop from '../hooks/useCombatLoop';
import useEnemyTeam from '../hooks/useEnemyTeam';
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
};

export type CountContextType = {
  partyActionCount: ActionCountObj[];
  enemiesActionCount: ActionCountObj[];
};

export const battleContext = createContext<CountContextType | null>(null);

export default function Battle({ encounter }: { encounter: Encounter }) {
  const [actionArray, setActionArray] = useState<any[]>([]);

  const isActionRunning = useRef(false);
  const [reRender, setReRender] = useState<boolean | undefined>();
  // HP management variables
  const [party, setParty] = useParty(); // Uses the global party state. info should be persisted even out of encounter.
  const [enemyTeam, setEnemyTeam] = useEnemyTeam(encounter.enemyTeam); // Uses an instance of the encounter enemy team as state.

  // Action Queues that manage turn system
  const { current: activeEnemiesIdsQueue } = useRef<number[]>([]);
  const { current: activeAlliesIdsQueue } = useRef<number[]>([]);

  const { current: partyActionCount } = useRef<ActionCountObj[]>(
    party.map(ally => {
      return { id: ally.id, speed: ally.stats.speed, count: 0 };
    })
  );

  useEffect(() => {
    if (!isActionRunning) {
      console.log('action', actionArray[0]?.enemyRef?.name);
    }
  }, [actionArray]);

  const { current: enemiesActionCount } = useRef<ActionCountObj[]>(
    enemyTeam.map(enemy => {
      return { id: enemy.id, speed: enemy.stats.speed, count: 0 };
    })
  );
  const battleCountContext = {
    partyActionCount,
    enemiesActionCount,
  };

  function concedeRewards() {
    console.log('rewards granted');
  }

  async function performAction(
    action: CombatAction,
    performer: Ally | Enemy,
    foe: Ally | Enemy
  ) {
    isActionRunning.current = true;
    setReRender(value => !value);

    await wait(1000);

    const healthDelta = calculateHealthDelta(
      action,
      performer.stats,
      foe.stats
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
        foeCopy.currentHp = 0;
        foeCopy.stats.isDead = true;
      } else {
        foeCopy.stats.isDead = false;
      }
      if (foeCopy.currentHp > foe.stats.hp) {
        foeCopy.currentHp = foe.stats.hp;
      }

      // console.log(action, foe.name + ' is foe', healthDelta);
      foe.isAlly
        ? setParty(newTeam as Ally[])
        : setEnemyTeam(newTeam as Enemy[]);
    }
    performer.isAlly
      ? activeAlliesIdsQueue.splice(
          activeAlliesIdsQueue.findIndex(id => id === performer.id),
          1
        )
      : activeEnemiesIdsQueue.splice(
          activeEnemiesIdsQueue.findIndex(id => id === performer.id),
          1
        );
    // setReRender(value => !value);
    isActionRunning.current = false;
    setReRender(value => !value);
    setActionArray(oldArray => oldArray.filter((_, index) => index !== 0));
    await wait(1000);
  }

  useCombatLoop((a: number, b: number, c: { current: number }) => {
    if (reRender === undefined) {
      setReRender(true);
      return;
    }

    if (
      party.every(ally => ally.stats.isDead) ||
      enemyTeam.every(enemy => enemy.stats.isDead)
    ) {
      return;
    }
    // add ally id to action queue if count is 10000
    partyActionCount.forEach(ally => {
      if (ally.count > 10000) {
        activeAlliesIdsQueue.push(ally.id);
        if (activeAlliesIdsQueue.length === 1) {
          setReRender(value => !value);
        }
        ally.count = 0;
      }
      // update ally action count
      const allyObjRef = party.find(char => ally.id === char.id);
      if (allyObjRef && !allyObjRef.stats.isDead) {
        ally.count += b * ally.speed;
      }
    });
    // add enemy id to action queue if count is 10000
    enemiesActionCount.forEach(enemy => {
      if (enemy.count > 10000) {
        activeEnemiesIdsQueue.push(enemy.id);
        // -------

        const enemyRef = enemyTeam.find(opponent => {
          return opponent.id === enemy.id;
        });
        if (enemyRef) {
          const action = getCombatAction(enemyRef);
          let foe = getRandomFromArray(
            party.filter(ally => ally.currentHp > 0)
          );
          if (action.isFriendly) {
            foe = getRandomFromArray(enemyTeam);
          }

          setActionArray(oldArray => [...oldArray, enemyRef.name]);
          // setActionArray(oldArray => [...oldArray, { action, enemyRef, foe }]);
        }

        // -----------

        if (isActionRunning.current) {
          setReRender(value => !value);
        }
        enemy.count = 0;
      }
      // update enemy action count
      const enemyObjRef = enemyTeam.find(char => enemy.id === char.id);
      const isEnemyActive = activeEnemiesIdsQueue.some(
        activeId => activeId === enemy.id
      );
      if (enemyObjRef && !enemyObjRef.stats.isDead && !isEnemyActive) {
        enemy.count += b * enemy.speed;
      }
    });

    // trigger action if no action is running
    c.current += b;
    if (!isActionRunning.current && activeEnemiesIdsQueue.length) {
      const enemy = enemyTeam.find(opponent => {
        return opponent.id === activeEnemiesIdsQueue[0];
      });
      if (enemy) {
        const action = getCombatAction(enemy);
        let foe = getRandomFromArray(party.filter(ally => ally.currentHp > 0));
        if (action.isFriendly) {
          foe = getRandomFromArray(enemyTeam);
        }
        performAction(action, enemy, foe as Ally | Enemy);
      }
      c.current = 0;
    }
  });

  if (party.every(ally => ally.stats.isDead)) {
    return <div>game over</div>;
  }
  if (enemyTeam.every(enemy => enemy.stats.isDead)) {
    concedeRewards();
    return <div>you win</div>;
  }
  return (
    <div
      css={css`
        display: flex;
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
                ${activeEnemiesIdsQueue.some(
                  activesId => activesId === enemy.id
                )
                  ? 'background-color: green'
                  : ''};
                ${activeEnemiesIdsQueue[0] === enemy.id
                  ? 'background-color: red'
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
                <ActiveBar id={enemy.id} max={10000} barName={'action'} />
              </battleContext.Provider>
            </div>
          );
        })}
      </div>
      <div>
        {party.map(ally => (
          <div key={ally.id}>
            <div>{ally.name}</div>
            <div>{ally.currentHp}</div>
            <ProgressBar
              current={ally.currentHp}
              max={ally.stats.hp}
              barName={'HP'}
            />
            <battleContext.Provider value={battleCountContext}>
              <ActiveBar
                id={ally.id}
                max={10000}
                barName={'action'}
                isAlly={true}
              />
            </battleContext.Provider>
            {ally.actions.map(action => {
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    let foe = getRandomFromArray(
                      enemyTeam.filter(enemy => {
                        return !enemy.stats.isDead;
                      })
                    );
                    if (action.isFriendly) {
                      foe = getRandomFromArray(party);
                    }
                    performAction(action, ally, foe as Ally | Enemy);
                  }}
                  css={css`
                    display: ${activeAlliesIdsQueue[0] === ally.id
                      ? 'auto'
                      : 'none'};
                  `}
                >
                  {action.name}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <ul>
        {activeEnemiesIdsQueue.map(id => {
          const enemyRef = enemyTeam.find(enemy => enemy.id === id);
          return <li key={id}>{enemyRef?.name}</li>;
        })}
      </ul>
    </div>
  );
}
