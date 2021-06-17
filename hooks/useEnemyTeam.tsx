import { klona } from 'klona';
import { useState } from 'react';
import { Enemy } from '../database/enemies';

export default function useEnemyTeam(enemyTeam: Enemy[]) {
  const enemyTeamInstance = klona(enemyTeam);
  return useState(enemyTeamInstance);
}
