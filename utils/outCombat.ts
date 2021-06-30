import { klona } from 'klona';
import { CombatAction } from '../database/actions';
import { Ally } from '../database/party';
import { calculateHealthDelta } from './combat';

export function performOutCombatAllyAction(
  action: CombatAction,
  performer: Ally,
  foe: Ally = performer
) {
  if (action.isFlee) {
    throw Error('you are not in combat');
  }
  const healthDelta = calculateHealthDelta(action, performer.stats, foe.stats);
  const newFoe = klona(foe);
  if (!newFoe) return;
  newFoe.currentHp += healthDelta.hpDelta;
  newFoe.stats.isDead = newFoe.currentHp > 0 ? false : true;
  if (newFoe.currentHp > newFoe.stats.hp) newFoe.currentHp = newFoe.stats.hp;
  return newFoe;
}
