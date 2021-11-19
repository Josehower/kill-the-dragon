import { Dispatch, SetStateAction, useEffect } from 'react';
import { Persona } from '../components/BattlePersona';
import { Ally } from '../database/party';

export default function useTeamStateNormalizer<T extends Persona>(
  team: T[],
  setTeam: Dispatch<SetStateAction<T[]>>
) {
  return useEffect(() => {
    if (
      team.some(persona => {
        return (
          (persona.stats.isDead && persona.currentHp > 0) ||
          (!persona.stats.isDead && persona.currentHp <= 0) ||
          persona.currentHp > persona.stats.hp ||
          persona.currentHp < 0
        );
      })
    ) {
      setTeam(current =>
        current.map(persona => {
          const newStatus = persona.currentHp <= 0;
          const maxHp = persona.stats.hp;
          return {
            ...persona,
            currentHp: newStatus
              ? 0
              : persona.currentHp > maxHp
              ? maxHp
              : persona.currentHp,
            stats: { ...persona.stats, isDead: newStatus },
          };
        })
      );
    }
  }, [team]);
}
