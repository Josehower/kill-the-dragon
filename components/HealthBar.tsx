/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export default function HealthBar({
  currentHealth,
  maxHealth,
  barName,
}: {
  currentHealth: number;
  maxHealth: number;
  barName?: string;
}) {
  const width = (currentHealth * 100) / maxHealth;

  return (
    <div
      css={css`
        background-color: blue;
        width: ${200}px;
        height: 1em;
        overflow: hidden;
        border: green solid 3px;
        color: white;
      `}
    >
      <div
        css={css`
          background-color: red;
          width: ${width}%;
          height: 1em;
        `}
      >
        {barName || ''}
      </div>
    </div>
  );
}
