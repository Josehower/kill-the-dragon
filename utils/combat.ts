import { CombatAction, DmgSource } from '../database/actions';
import { CombatStats } from '../database/enemies';
import { GameWeapon } from '../database/inventory';

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
      return {
        hpDelta: 0,
        isResistent: false,
        isWeak: false,
        isHealed: false,
        isDodged: false,
      };
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
      return {
        hpDelta: 0,
        isResistent: false,
        isWeak: false,
        isHealed: false,
        isDodged: false,
      };
    }
  }

  if (isAttackDodged(performerStats.acc, foeStats.dex)) {
    return {
      hpDelta: 0,
      isResistent: false,
      isWeak: false,
      isHealed: false,
      isDodged: true,
    };
  }

  const damageBase = action.isMagic ? performerStats.mDmg : performerStats.pDmg;

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

  const damageCaused = damageBase * weaponMod * resistanceMod * weaknessMod;
  console.log({
    damageBase: damageBase,
    weaponMod: weaponMod,
    resistanceMod: resistanceMod,
    weaknessMod: weaknessMod,
  });
  console.log({
    hpDelta: -damageCaused,
    isResistent: resistanceMod < 1,
    isWeak: weaknessMod === 2,
    isHealed: false,
    isDodged: false,
  });
  return {
    hpDelta: -damageCaused,
    isResistent: resistanceMod < 1,
    isWeak: weaknessMod === 2,
    isHealed: false,
    isDodged: false,
  };
}
