import { css } from '@emotion/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { CombatAction } from '../database/actions';
import { Encounter } from '../database/encounters';
import { Enemy } from '../database/enemies';
import { Ally } from '../database/party';
import useEnemyTeam from '../hooks/useEnemyTeam';
import useGameLoop from '../hooks/useGameLoop';
import useInventory from '../hooks/useInventory';
import useParty from '../hooks/useParty';
import useTeamStateNormalizer from '../hooks/useTeamStateNormalizer';
import { calculateHealthDelta } from '../utils/combat';
import { wait } from '../utils/wait';
import { Persona } from './BattlePersona';
import BattleTeam from './BattleTeam';

export enum BattleState {
  flee = 'FLEE',
  win = 'WIN',
  lost = 'LOST',
  active = 'ACTIVE',
}
export type ActionToPerform<T extends Persona> = {
  action: CombatAction;
  performer: T;
  foe: T;
};

export default function Battle({
  encounter,
  setEncounter,
}: {
  encounter: Encounter;
  setEncounter: Dispatch<SetStateAction<Encounter | null>>;
}) {
  const [enemyTeam, setEnemyTeam] = useEnemyTeam(encounter.enemyTeam);

  const [party, setParty] = useParty();

  const partyInventory = useInventory();

  const [actionArr, setActionArr] = useState<ActionToPerform<Persona>[]>([]);

  const [allyActionQueue, setAllyActionQueue] = useState<number[]>([]);

  const [battleState, setBattleState] = useState<BattleState>(
    BattleState.active
  );

  const [activeId, setActiveId] = useState<number>();

  const isActionHappening = useRef(false);
  const isBattleActive = useRef(true);

  console.log('outsider current BA', isBattleActive.current);

  async function performAction<T extends Persona>({
    action,
    performer,
    foe,
  }: ActionToPerform<T>) {
    // TODO: avoid the game keep running actions after battle end. Solve this issue better, maybe move battle state to the parent component
    if (!isBattleActive.current) return;
    if (performer.stats.isDead) return;

    isActionHappening.current = true;

    setActiveId(performer.id);

    if (action.isFlee) {
      if (performer.isAlly) {
        console.log('team flee');
        setBattleState(BattleState.flee);
      } else {
        setEnemyTeam(enemy =>
          enemy.filter(person => person.id !== performer.id)
        );
        console.log(performer.name + ' is scared and scaped!');
      }
      isActionHappening.current = false;
      return;
    }

    const healthDelta = calculateHealthDelta(
      action,
      performer.stats,
      foe.stats,
      performer.weapon
    );

    console.log(
      performer.name,
      'is using',
      action.name,
      'over',
      foe.name,
      '...'
    );

    console.log('waiting ', action.duration / 1000, ' seconds');
    await wait(action.duration);
    // if (!isBattleActive.current) {
    //   console.log('ACTION BLOCKED FOR BATTLE END');
    //   return;
    // }

    if (healthDelta.hpDelta > 0 && !healthDelta.isHealed) {
      healthDelta.hpDelta = 0;
    }

    console.log(healthDelta);

    if (foe.isAlly) {
      setParty(old =>
        old.map(persona => {
          if (persona.id === foe.id) {
            return {
              ...persona,
              currentHp: persona.currentHp + healthDelta.hpDelta,
            };
          }
          return persona;
        })
      );
    } else {
      setEnemyTeam(old =>
        old.map(persona => {
          if (persona.id === foe.id) {
            return {
              ...persona,
              currentHp: persona.currentHp + healthDelta.hpDelta,
            };
          }
          return persona;
        })
      );
    }

    console.log('done');
    isActionHappening.current = false;
    setActiveId(undefined);
  }

  // Update the isDead property in the team
  useTeamStateNormalizer<Enemy>(enemyTeam, setEnemyTeam);
  useTeamStateNormalizer<Ally>(party, setParty);

  useGameLoop<number>((a, b, c) => {
    if (isActionHappening.current) return;

    const halfSecond = Math.round(a / 500);
    const interval = 1;

    // make something each interval in halfSecond
    if (!c.current || c.current + (interval - 1) < halfSecond) {
      c.current = halfSecond;

      setActionArr(current => {
        if (current.length === 0) return current;
        performAction(current[0]).catch(console.log);
        return current.filter((a_a, i) => i !== 0);
      });
    }
  });

  useEffect(() => {
    // set state when game loss
    if (party.every(ally => ally.stats.isDead)) {
      setBattleState(BattleState.lost);
      return;
    }
    // filter out ids that are dead from the select action queue
    setAllyActionQueue(current => {
      const newArr = current.filter(allyId => {
        const partyRef = party.find(singleAlly => allyId === singleAlly.id);
        if (!partyRef) return false;
        return !partyRef.stats.isDead;
      });
      console.log(newArr);
      return newArr;
    });
  }, [party]);

  useEffect(() => {
    // set state when game win
    if (enemyTeam.every(enemy => enemy.stats.isDead)) {
      setBattleState(BattleState.win);
      return;
    }
  }, [enemyTeam]);

  useEffect(() => {
    // set state when game win
    if (battleState === BattleState.win) {
      console.log(party);
      function calculateReward(expOrGold: number, enemyTeamRef: Enemy[]) {
        return expOrGold * enemyTeamRef.length;
      }
      const exp = calculateReward(encounter.expReward, enemyTeam);
      const gold = calculateReward(encounter.goldReward, enemyTeam);
      partyInventory[1](current => {
        return { ...current, gold: current.gold + gold };
      });
      setParty(current =>
        current.map(ally => {
          if (ally.stats.isDead) return ally;
          return { ...ally, exp: ally.exp + exp };
        })
      );
      party.forEach(ally =>
        console.log(ally.name, ally.stats.isDead, ally.exp)
      );
      console.log(
        `the team earned ${gold} gold and each alive ally earned ${exp} exp`
      );
      return;
    }
  }, [
    battleState,
    encounter.expReward,
    encounter.goldReward,
    enemyTeam,
    party,
    partyInventory,
    setParty,
  ]);

  useEffect(() => {
    setBattleState(BattleState.active);
  }, []);

  if (battleState === BattleState.lost) {
    isBattleActive.current = false;
    return (
      <div>
        YOU LOSE{' '}
        <button
          onClick={() => {
            window.location.reload();
          }}
        >
          stop
        </button>
      </div>
    );
  }

  if (battleState === BattleState.win) {
    isBattleActive.current = false;
    return (
      <div>
        YOU WIN{' '}
        <button
          onClick={() => {
            setEncounter(null);
          }}
        >
          stop
        </button>
      </div>
    );
  }

  if (battleState === BattleState.flee) {
    isBattleActive.current = false;
    return (
      <div>
        YOU ARE THE COWARD
        <button
          onClick={() => {
            setEncounter(null);
          }}
        >
          stop
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        css={css`
          display: flex;
        `}
      >
        <BattleTeam
          team={enemyTeam}
          // setTeam={setEnemyTeam}
          opponentTeam={party}
          actionArr={actionArr}
          setActionArr={setActionArr}
          activeId={activeId}
        />
      </div>
      <div
        css={css`
          display: flex;
        `}
      >
        <BattleTeam
          team={party}
          // setTeam={setParty}
          opponentTeam={enemyTeam}
          actionArr={actionArr}
          setActionArr={setActionArr}
          allyActionQueue={allyActionQueue}
          setAllyActionQueue={setAllyActionQueue}
          inventory={partyInventory}
          activeId={activeId}
        />
      </div>
      <button
        onClick={() => {
          setEnemyTeam(team =>
            team.map(enemy => {
              enemy.currentHp = 0;
              return enemy;
            })
          );
        }}
      >
        win
      </button>
    </div>
  );
}
