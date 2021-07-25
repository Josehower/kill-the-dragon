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
  const barRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  console.log('render');
  useCombatLoop((a: number, b: number, c: { current: number }) => {
    if (barRef.current !== null) {
      const myCount =
        countArray.find(countObj => countObj.id === id)?.count || 0;
      barRef.current.style.transform = `scaleX(${myCount / max})`;
      // barRef.current.innerText = `${myCount / max}%`;
    }

    return 'bar';
  });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div
      css={css`
        background-color: ${colors?.[0] || '#000000'};
        width: ${200}px;
        padding: 0;
        height: 1.5em;
        overflow: hidden;
        border: ${colors?.[3] || 'black'} solid 1px;
        color: ${colors?.[2] || 'white'};
      `}
    >
      <div
        ref={barRef}
        css={css`
          background-color: ${colors?.[1] || 'white'};
          border: ${colors?.[1] || 'white'} solid 1px;
          transform-origin: ${isAlly ? '0% 50%' : '100% 50%'};
          width: 100%;
          transform: scaleX(0);
          padding: 0;
          margin: 0;
          height: 1em;
          font-size: 0.3em;
          color: blue;
          transition: all 0.3s;
        `}
      >
        {barName || ''}
      </div>
    </div>
  );
}
