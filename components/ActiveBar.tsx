/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useContext, useEffect, useRef, useState } from 'react';
import useCombatLoop from '../hooks/useCombatLoop';
import { battleContext, CountContextType } from './Battle';

type Colors = string[];

export default function ActiveBar({
  max,
  barName,
  colors,
  isAlly = false,
  id,
}: {
  id: number;
  isAlly?: boolean;
  max: number;
  barName?: string;
  colors?: Colors;
}) {
  const { partyActionCount, enemiesActionCount } = useContext(
    battleContext
  ) as CountContextType;

  const countArray = isAlly ? partyActionCount : enemiesActionCount;
  const countRef = countArray.find(countObj => countObj.id === id)?.count || 0;
  const [count, setCount] = useState(() => countRef);
  const isMounted = useRef(true);

  const width = (count * 100) / max;

  const animationFrame = useCombatLoop(
    (a: number, b: number, c: { current: number }) => {
      c.current += b;
      if (c.current >= 1000 / 60 && isMounted.current) {
        setCount(
          () => countArray.find(countObj => countObj.id === id)?.count || 0
        );
        c.current = 0;
      }
    }
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div
      css={css`
        background-color: ${colors?.[0] || 'blue'};
        width: ${200}px;
        height: 1em;
        overflow: hidden;
        border: ${colors?.[3] || 'green'} solid 3px;
        color: ${colors?.[2] || 'white'};
      `}
    >
      <div
        css={css`
          background-color: ${colors?.[1] || 'magenta'};
          width: ${width}%;
          height: 1em;
        `}
      >
        {barName || ''}
      </div>
    </div>
  );
}
