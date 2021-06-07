/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { klona } from 'klona';
import { useRef, useState } from 'react';
import { CombatAction } from '../database/actions';
import { Encounter } from '../database/encounters';
import { Enemy } from '../database/enemies';
import { Ally } from '../database/party';
import useParty from '../hooks/useParty';
import useCombatLoop from '../hooks/useCombatLoop';
import { calculateHealthDelta, getCombatAction } from '../utils/combat';
import { getRandomFromArray } from '../utils/miscelaneous';
import HealthBar from './HealthBar';

type ActionCountObj = {
  id: number;
  speed: number;
  count: number;
};

type CombatEnemyHpObject = {
  id: number;
  hp: number;
  isDead: boolean;
};

export default function Battle({ encounter }: { encounter: Encounter }) {
  const enemiesHpInitializer = () =>
    encounter.enemyTeam.map(enemy => {
      return { id: enemy.id, hp: enemy.stats.hp, isDead: enemy.stats.isDead };
    });

  // HP management variables
  const { party, setParty } = useParty(); // Uses the global party state. info should be persisted even out of encounter.
  const [enemiesHpObj, setEnemiesHpObj] =
    useState<CombatEnemyHpObject[]>(enemiesHpInitializer); // Uses shallow copy of enemies to recreate encounter multiple times.

  // Action Queues that manage turn system
  const { current: activeEnemiesIdsQueue } = useRef<number[]>([]);
  const { current: activeAlliesIdsQueue } = useRef<number[]>([]);

  const { current: partyActionCount } = useRef<ActionCountObj[]>(
    party.map(ally => {
      return { id: ally.id, speed: ally.stats.speed, count: 0 };
    })
  );

  const { current: enemiesActionCount } = useRef<ActionCountObj[]>(
    encounter.enemyTeam.map(enemy => {
      return { id: enemy.id, speed: enemy.stats.speed, count: 0 };
    })
  );

  function concedeRewards() {
    console.log('rewards granted');
  }

  function performAction(
    action: CombatAction,
    performer: Ally | Enemy,
    foe: Ally | Enemy
  ) {
    const healthDelta = calculateHealthDelta(
      action,
      performer.stats,
      foe.stats
    );

    if (healthDelta.hpDelta > 0 && !healthDelta.isHealed) {
      healthDelta.hpDelta = 0;
    }

    if (foe.isAlly) {
      const newParty = klona(party);
      const foeCopy = newParty.find(ally => ally.id === foe.id);
      if ('currentHp' in foe && foeCopy) {
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

        console.log(action, foe.name + ' is foe', healthDelta);
        setParty(newParty);
      }
    } else {
      const newEnemiesHpObj = klona(enemiesHpObj);
      const foeHealthObjCopy = newEnemiesHpObj.find(
        enemy => enemy.id === foe.id
      );
      if (foeHealthObjCopy?.hp) {
        foeHealthObjCopy.hp += healthDelta.hpDelta;
        if (foeHealthObjCopy.hp <= 0) {
          foeHealthObjCopy.hp = 0;
          foeHealthObjCopy.isDead = true;
        } else {
          foeHealthObjCopy.isDead = false;
        }
        if (foeHealthObjCopy.hp > foe.stats.hp) {
          foeHealthObjCopy.hp = foe.stats.hp;
        }

        console.log(action, foe.name + ' is foe', healthDelta);
        setEnemiesHpObj(newEnemiesHpObj);
      }
    }
  }

  useCombatLoop((a: number, b: number, c: { current: number }) => {
    if (
      party.every(ally => ally.stats.isDead) ||
      enemiesHpObj.every(enemy => enemy.isDead)
    ) {
      return;
    }
    // add enemy id to action queue if count is 10000
    partyActionCount.forEach(ally => {
      if (ally.count > 10000) {
        console.log(activeAlliesIdsQueue);
        activeAlliesIdsQueue.push(ally.id);
        ally.count = 0;
      }
      // update enemy action count
      ally.count += b * ally.speed;
    });

    enemiesActionCount.forEach(enemy => {
      if (enemy.count > 10000) {
        activeEnemiesIdsQueue.push(enemy.id);
        enemy.count = 0;
      }
      // update enemy action count
      enemy.count += b * enemy.speed;
    });

    // trigger action every second
    c.current += b;
    if (c.current >= 1000) {
      console.log(activeEnemiesIdsQueue);
      const enemy = encounter.enemyTeam.find(opponent => {
        return opponent.id === activeEnemiesIdsQueue[0];
      });

      if (enemy) {
        const action = getCombatAction(enemy);
        let foe = getRandomFromArray(party.filter(ally => ally.currentHp > 0));
        if (action.isFriendly) {
          foe = getRandomFromArray(encounter.enemyTeam);
        }
        performAction(action, enemy, foe as Ally | Enemy);
        activeEnemiesIdsQueue.shift();
      }
      c.current = 0;
    }
  });

  if (party.every(ally => ally.stats.isDead)) {
    return <div>game over</div>;
  }
  if (enemiesHpObj.every(enemy => enemy.isDead)) {
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
        {encounter.enemyTeam.map(enemy => {
          const enemyHpObjRef = enemiesHpObj.find(
            hpObj => hpObj.id === enemy.id
          );
          return (
            <div key={enemy.id}>
              <div>{enemy.name}</div>
              <div>{enemyHpObjRef?.hp}</div>
              <HealthBar
                currentHealth={enemyHpObjRef?.hp || 0}
                maxHealth={enemy.stats.hp}
              />
            </div>
          );
        })}
      </div>
      <div>
        {party.map(ally => (
          <div key={ally.id}>
            <div>{ally.name}</div>
            <div>{ally.currentHp}</div>
            <HealthBar
              currentHealth={ally.currentHp}
              maxHealth={ally.stats.hp}
            />
            {ally.actions.map(action => {
              return (
                <button
                  onClick={() => {
                    let foe = getRandomFromArray(
                      encounter.enemyTeam.filter(enemy => {
                        const hpRef = enemiesHpObj.find(
                          hpObj => hpObj.id === enemy.id
                        );
                        return hpRef && hpRef.hp > 0;
                      })
                    );
                    if (action.isFriendly) {
                      foe = getRandomFromArray(party);
                    }
                    performAction(action, ally, foe as Ally | Enemy);
                    activeAlliesIdsQueue.splice(
                      activeAlliesIdsQueue.findIndex(id => id === ally.id),
                      1
                    );
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
    </div>
  );
}
