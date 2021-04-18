/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { klona } from 'klona';
import { useState } from 'react';
import { CombatAction } from '../database/actions';
import { Encounter } from '../database/encounters';
import { Enemy } from '../database/enemies';
import { Ally } from '../database/party';
import useParty from '../hooks/useParty';
import { calculateHealthDelta, getCombatAction } from '../utils/combat';
import { getRandomFromArray } from '../utils/miscelaneous';
import HealthBar from './HealthBar';

export default function Battle({ encounter }: { encounter: Encounter }) {
  const { party, setParty } = useParty();
  const [enemiesHpObj, setEnemiesHpObj] = useState<
    { id: number; hp: number; isDead: boolean }[]
  >(
    encounter.enemyTeam.map(enemy => {
      return { id: enemy.id, hp: enemy.stats.hp, isDead: enemy.stats.isDead };
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
        {encounter.enemyTeam.map(enemy => (
          <div key={enemy.id}>
            <div>{enemy.name}</div>
            <div>{enemiesHpObj.find(hpObj => hpObj.id === enemy.id)?.hp}</div>
            <HealthBar
              currentHealth={
                enemiesHpObj.find(hpObj => hpObj.id === enemy.id)?.hp || 0
              }
              maxHealth={enemy.stats.hp}
            />
            <button
              disabled={
                enemiesHpObj.find(hpObj => hpObj.id === enemy.id)?.isDead
              }
              onClick={() => {
                const action = getCombatAction(enemy);
                let foe = getRandomFromArray(
                  party.filter(ally => ally.currentHp > 0)
                );
                if (action.isFriendly) {
                  foe = getRandomFromArray(encounter.enemyTeam);
                }
                performAction(action, enemy, foe as Ally | Enemy);
              }}
            >
              attack
            </button>
          </div>
        ))}
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
            <button
              disabled={ally.stats.isDead}
              onClick={() => {
                const action = getCombatAction(ally);
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
              }}
            >
              attack
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
