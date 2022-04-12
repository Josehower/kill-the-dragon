/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef } from 'react';
import useGameLoop from '../hooks/useGameLoop';

type Props = {
  endTime: number;
  startTime: number;
  callback: () => void;
};

export default function TimedBar({ endTime, startTime, callback }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  const timeout = useRef<boolean>(false);

  useGameLoop(() => {
    if (!timeout.current && barRef.current !== null) {
      const timer = +Date.now() - endTime;

      barRef.current.style.transform = `scaleX(${
        (+Date.now() - startTime) / ((startTime - endTime) * -1)
      })`;

      if (timer >= 0) {
        timeout.current = true;
        callback();
      }
    }
  });

  return (
    <div
      css={css`
        background-color: rgba(43, 34, 27, 255);
        width: ${200}px;
        border-radius: 20px;
        padding: 0;
        overflow: hidden;
        border: ${'black'} solid 1px;
        color: ${'white'};
      `}
    >
      <div
        ref={barRef}
        css={css`
          background-color: rgba(252, 53, 76, 255);
          border: rgba(43, 34, 27, 255) solid 1px;
          transform-origin: 0% 50%;
          width: 100%;
          transform: scaleX(0);
          padding: 0;
          margin: 0;
          height: 1rem;
          font-size: 0.3em;
          transition: all 0.05s;
        `}
      />
    </div>
  );
}
