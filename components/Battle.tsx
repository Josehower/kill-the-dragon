import { css } from '@emotion/react';
import {
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
import useEnemyTeam from '../hooks/useEnemyTeam';
import useGameLoop from '../hooks/useGameLoop';
import useInventory from '../hooks/useInventory';
import useParty from '../hooks/useParty';
import useTeamStateNormalizer from '../hooks/useTeamStateNormalizer';
import { calculateHealthDelta } from '../utils/combat';
import { getStatsByExp } from '../utils/miscelaneous';
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
    BattleState.active,
  );

  const [activeAction, setActiveAction] = useState<{
    performerId: number;
    foeId: number;
    action: CombatAction;
  }>();

  const isActionHappening = useRef(false);
  const isBattleActive = useRef(true);

  async function performAction<T extends Persona>({
    action,
    performer,
    foe,
  }: ActionToPerform<T>) {
    // TODO: avoid the game keep running actions after battle end. Solve this issue better, maybe move battle state to the parent component
    if (!isBattleActive.current) return;
    if (performer.stats.isDead) return;

    isActionHappening.current = true;

    setActiveAction({
      performerId: performer.id,
      foeId: foe.id,
      action: action,
    });

    if (action.isFlee) {
      if (performer.isAlly) {
        setBattleState(BattleState.flee);
      } else {
        setEnemyTeam((enemy) =>
          enemy.filter((person) => person.id !== performer.id),
        );
      }
      isActionHappening.current = false;
      return;
    }

    const healthDelta = calculateHealthDelta(
      action,
      performer.stats,
      foe.stats,
      performer.weapon,
    );

    await wait(action.duration);
    // TODO: solve this in a better way
    // This is indeed necessary but the pattern is weird
    // if (!isBattleActive.current) {
    //   console.log('ACTION BLOCKED FOR BATTLE END');
    //   return;
    // }

    if (healthDelta.hpDelta > 0 && !healthDelta.isHealed) {
      healthDelta.hpDelta = 0;
    }

    if (foe.isAlly) {
      setParty((old) =>
        old.map((persona) => {
          if (persona.id === foe.id) {
            return {
              ...persona,
              currentHp: persona.currentHp + healthDelta.hpDelta,
            };
          }
          return persona;
        }),
      );
    } else {
      setEnemyTeam((old) =>
        old.map((persona) => {
          if (persona.id === foe.id) {
            return {
              ...persona,
              currentHp: persona.currentHp + healthDelta.hpDelta,
            };
          }
          return persona;
        }),
      );
    }

    isActionHappening.current = false;
    setActiveAction(undefined);
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

      setActionArr((current) => {
        if (current.length === 0) return current;
        performAction(current[0]!).catch(console.log);
        return current.filter((a_a, i) => i !== 0);
      });
    }
  });

  useEffect(() => {
    // set state when game loss
    if (party.every((ally) => ally.stats.isDead)) {
      setBattleState(BattleState.lost);
      return;
    }
    // filter out ids that are dead from the select action queue
    setAllyActionQueue((current) => {
      const newArr = current.filter((allyId) => {
        const partyRef = party.find((singleAlly) => allyId === singleAlly.id);
        if (!partyRef) return false;
        return !partyRef.stats.isDead;
      });
      return newArr;
    });
  }, [party]);

  const calculateReward = useCallback(
    (expOrGold: number) => {
      return expOrGold * enemyTeam.length;
    },
    [enemyTeam.length],
  );

  useEffect(() => {
    // set state when game win
    if (
      enemyTeam.every((enemy) => enemy.stats.isDead) &&
      isBattleActive.current
    ) {
      const exp = calculateReward(encounter.expReward);
      const gold = calculateReward(encounter.goldReward);
      partyInventory[1]((current) => {
        return { ...current, gold: current.gold + gold };
      });
      setParty((current) =>
        current.map((ally) => {
          if (ally.stats.isDead) return ally;
          const newExp = ally.exp + exp;
          const newStats = getStatsByExp(newExp);
          return {
            ...ally,
            exp: newExp,
            stats: { ...newStats },
          };
        }),
      );

      setBattleState(BattleState.win);
      return;
    }
  }, [
    battleState,
    calculateReward,
    encounter.expReward,
    encounter.goldReward,
    partyInventory,
    setParty,
    enemyTeam,
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
            console.log('you lost please reload');
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
    <>
      <div
        css={css`
          background-image: ${encounter.background
            ? `url(${encounter.background})`
            : 'none'};
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          margin-left: -30px;
        `}
      >
        <div>
          <BattleTeam
            team={enemyTeam}
            // setTeam={setEnemyTeam}
            opponentTeam={party}
            actionArr={actionArr}
            setActionArr={setActionArr}
            activeAction={activeAction}
          />
        </div>
        <div>
          <BattleTeam
            team={party}
            // setTeam={setParty}
            opponentTeam={enemyTeam}
            actionArr={actionArr}
            setActionArr={setActionArr}
            allyActionQueue={allyActionQueue}
            setAllyActionQueue={setAllyActionQueue}
            inventory={partyInventory}
            activeAction={activeAction}
          />
        </div>
      </div>
      {/* <button
        onClick={() => {
          setEnemyTeam((team) =>
            team.map((enemy) => {
              enemy.currentHp = 0;
              return enemy;
            }),
          );
        }}
      >
        win
      </button> */}
    </>
  );
}
