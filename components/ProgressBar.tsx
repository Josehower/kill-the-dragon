import { css } from '@emotion/react';

type Colors = string[];

export default function ProgressBar({
  current,
  max,
  barName,
  colors,
}: {
  current: number;
  max: number;
  barName?: string;
  colors?: Colors;
}) {
  const width = (current * 100) / max;

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
