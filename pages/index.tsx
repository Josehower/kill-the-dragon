import { css } from '@emotion/react';
import Link from 'next/link';

export default function Home() {
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <Link href="/game">
        <a
          css={css`
            font-size: 30px;
            :hover {
              transform: scale(1.2);
              cursor: pointer;
            }
          `}
        >
          Start Game
        </a>
      </Link>
    </div>
  );
}
