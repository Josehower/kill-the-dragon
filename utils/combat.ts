import { CombatAction, combatActions, DmgSource } from '../database/actions';
import { CombatStats, Enemy } from '../database/enemies';
import { GameWeapon } from '../database/inventory';
import { Ally } from '../database/party';
import { getRandomFromArray } from './miscelaneous';

type HealthDelta = {
  hpDelta: number;
  isDodged: boolean;
  isResistent: boolean;
  isWeak: boolean;
  isHealed: boolean;
};

function isAttackDodged(performerDex: number, foeAcc: number) {
  const dodgeMod = performerDex - foeAcc;
  const dodgeAttempt = Math.random();
  return dodgeAttempt <= dodgeMod;
}

export function calculateHealthDelta(
  action: CombatAction,
  performerStats: CombatStats,
  foeStats: CombatStats,
  weapon?: GameWeapon
): HealthDelta {
  if (!action.dmgSource) {
    throw Error(
      'calculateDamage only accept damaging actions as first argument'
    );
  }

  const failBaseResult = {
    hpDelta: 0,
    isResistent: false,
    isWeak: false,
    isHealed: false,
    isDodged: false,
  };

  if (action.dmgSource === DmgSource.heal) {
    if (!foeStats.isDead) {
      return {
        hpDelta: 50,
        isResistent: false,
        isWeak: false,
        isHealed: true,
        isDodged: false,
      };
    } else {
      return failBaseResult;
    }
  }
  if (action.dmgSource === DmgSource.revive) {
    if (foeStats.isDead) {
      return {
        hpDelta: 40,
        isResistent: false,
        isWeak: false,
        isHealed: true,
        isDodged: false,
      };
    } else {
      return failBaseResult;
    }
  }

  if (isAttackDodged(performerStats.acc, foeStats.dex)) {
    return {
      ...failBaseResult,
      isDodged: true,
    };
  }

  const damageBase = action.isMagic ? performerStats.mDmg : performerStats.pDmg;

  const actionDamageAmplifier = action.dmgMod || 1;

  const weaknessMod = foeStats.weakness === action.dmgSource ? 2 : 1;

  const weaponMod =
    weapon &&
    weapon.dmgAffinity.some((source: DmgSource) => action.dmgSource === source)
      ? weapon.dmgMod
      : 1;

  let resistanceMod = 1;
  if (foeStats.lvl > performerStats.lvl) {
    if (foeStats.lvl - performerStats.lvl > 2) {
      resistanceMod = 0.5;
    } else {
      resistanceMod = action.isMagic ? foeStats.mDef : foeStats.pDef;
    }
  }

  const damageCaused = Math.round(
    damageBase * weaponMod * resistanceMod * weaknessMod * actionDamageAmplifier
  );

  return {
    hpDelta: -damageCaused,
    isResistent: resistanceMod < 1,
    isWeak: foeStats.weakness === action.dmgSource,
    isHealed: false,
    isDodged: false,
  };
}

export function getCombatAction(character: Enemy | Ally): CombatAction {
  if (character.isAlly) {
    return getRandomFromArray((character as Ally).actions);
  }
  const frequencyMatcher = Math.random();

  const selectedAction = (character as Enemy).actions.find(
    action => action.frequency > frequencyMatcher
  )?.action;

  if (!selectedAction) return combatActions[0];
  return selectedAction;
}
