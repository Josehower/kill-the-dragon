import { css } from '@emotion/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { CombatAction } from '../database/actions';
import { ActionToPerform } from './Battle';
import BattlePersona, { Persona } from './BattlePersona';
import { PlayerInventory } from './structures/DomBasedComponent';

const imageDivStyle = css`
  display: flex;
  justify-content: center;
  background-color: rgba(11, 191, 188, 255);
  margin-top: 10px;
  height: 100px;
  width: 100px;
  overflow: hidden;
  border: solid 2px rgba(43, 34, 27, 255);
  border-radius: 5px;
`;

const personaBoxStyle = (isActive: boolean, isFoe: boolean) => css`
  background-color: ${isActive
    ? '#1bcf3f'
    : isFoe
    ? 'rgba(252, 53, 76, 255)'
    : 'rgba(16, 117, 128, 255)'};
  text-align: center;
  border: solid 2px rgba(43, 34, 27, 255);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 12px;
  width: 300px;
  height: 350px;
  color: rgb(245, 245, 229);

  button {
    background: rgb(245, 245, 229);
    border-radius: 5px;
    padding: 5px;
    font-size: 15px;
    font-weight: bold;
  }

  h2 {
    margin: 0;
    margin-bottom: 5px;
  }
  @media (max-height: 700px) {
    font-size: 10px;
    padding: 0;
    height: 45vh;

    div,
    button {
      transform: scale(0.9);
    }
  }
`;

type Props<T, O> = {
  team: T[];
  // setTeam: Dispatch<SetStateAction<T[]>>;
  opponentTeam: O[];
  actionArr: ActionToPerform<Persona>[];
  setActionArr: Dispatch<SetStateAction<ActionToPerform<Persona>[]>>;
  allyActionQueue?: number[];
  setAllyActionQueue?: Dispatch<SetStateAction<number[]>>;
  inventory?: [PlayerInventory, Dispatch<SetStateAction<PlayerInventory>>];
  activeAction?: {
    performerId: number;
    action: CombatAction;
    foeId: number;
  };
};

export default function BattleTeam<T extends Persona, O extends Persona>({
  team,
  opponentTeam,
  actionArr,
  setActionArr,
  allyActionQueue,
  setAllyActionQueue,
  inventory,
  activeAction,
}: Props<T, O>) {
  useEffect(() => {
    team.forEach((persona) => {
      if (persona.stats.isDead) {
        setActionArr((current) => {
          if (current.some((action) => action.performer.id === persona.id)) {
            return current.filter(
              (action) => action.performer.id !== persona.id,
            );
          } else {
            return current;
          }
        });
      }
    });
  });

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
      `}
    >
      {team.map((persona) => {
        const isActive = activeAction?.performerId === persona.id;
        const isFoe = activeAction?.foeId === persona.id;
        return (
          <div
            key={'dead-box-' + persona.id}
            css={personaBoxStyle(isActive, isFoe)}
          >
            <h2>{persona.name}</h2>
            {persona.currentHp / persona.stats.hp > 0.4
              ? `💗`
              : persona.currentHp !== 0
              ? `💔`
              : `💀`}
            {persona.currentHp} / {persona.stats.hp}
            <div css={imageDivStyle}>
              <img src={persona.image} alt="ally pic" />
            </div>
            <div
              css={css`
                p {
                  height: 20px;
                  padding: 5px;
                  margin: 0;
                }
                > div {
                  height: 50px;
                }
              `}
            >
              <p>
                {isActive
                  ? `Using ${activeAction.action.name}`
                  : isFoe
                  ? 'Being attacked...'
                  : ''}
              </p>
              {persona.stats.isDead ? (
                <div>DEAD</div>
              ) : (
                <BattlePersona
                  key={'alive-box-' + persona.id}
                  persona={persona}
                  setActionArr={setActionArr}
                  actionArr={actionArr}
                  foeOptions={{ friendly: team, unfriendly: opponentTeam }}
                  allyActionQueue={allyActionQueue}
                  setAllyActionQueue={setAllyActionQueue}
                  inventory={inventory}
                  // activeId={activeId}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
