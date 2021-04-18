/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { combatActions } from '../database/actions';
import { gameEnemies } from '../database/enemies';
import { calculateHealthDelta } from '../utils/combat';

export default function Home() {
  const [dragonHealth, setDragonHealth] = useState(gameEnemies[5].stats.hp);
  const [wolfHealth, setWolfHealth] = useState(gameEnemies[0].stats.hp);
  const blast = combatActions[1];
  const strike = combatActions[0];
  const dragon = gameEnemies[5];
  const wolf = gameEnemies[0];

  return (
    <>
      dragon: {dragonHealth}
      <br />
      wolf: {wolfHealth}
      <br />
      <button
        css={css`
          color: blue;
        `}
        onClick={() =>
          setWolfHealth(
            wolfHealth +
              calculateHealthDelta(blast, dragon.stats, wolf.stats).hpDelta
          )
        }
      >
        kill wolf
      </button>
      <button
        css={css`
          color: blue;
        `}
        onClick={() =>
          setDragonHealth(
            dragonHealth +
              calculateHealthDelta(strike, wolf.stats, dragon.stats).hpDelta
          )
        }
      >
        kill dragon
      </button>
    </>
  );
}
