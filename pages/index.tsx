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
      <Link
        css={css`
          font-size: 30px;
          :hover {
            transform: scale(1.2);
            cursor: pointer;
          }
        `}
        href="/game"
      >
        Start Game
      </Link>
    </div>
  );
}
