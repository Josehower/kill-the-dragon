import { css } from '@emotion/react';
import { Dispatch, SetStateAction } from 'react';
import { PlayerInventory } from '../components/GameObject';
import { ActionToPerform } from './Battle';
import BattlePersona, { Persona } from './BattlePersona';

type Props<T, O> = {
  team: T[];
  setTeam: Dispatch<SetStateAction<T[]>>;
  opponentTeam: O[];
  actionArr: ActionToPerform<Persona>[];
  setActionArr: Dispatch<SetStateAction<ActionToPerform<Persona>[]>>;
  allyActionQueue?: number[];
  setAllyActionQueue?: Dispatch<SetStateAction<number[]>>;
  inventory?: [PlayerInventory, Dispatch<SetStateAction<PlayerInventory>>];
  activeId?: number;
};

export default function BattleTeam<T extends Persona, O extends Persona>({
  team,
  opponentTeam,
  actionArr,
  setActionArr,
  allyActionQueue,
  setAllyActionQueue,
  inventory,
  activeId,
}: Props<T, O>) {
  return (
    <>
      {team.map(persona => {
        const isActive = activeId === persona.id;
        return (
          <div
            key={'dead-box-' + persona.id}
            css={css`
              background-color: ${isActive ? 'orange' : 'transparent'};
            `}
          >
            name: {persona.name}
            <br />
            hp: {persona.currentHp}
            <br />
            <br />
            {persona.stats.isDead ? (
              'Dead'
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
                activeId={activeId}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
