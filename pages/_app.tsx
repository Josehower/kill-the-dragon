import { css, Global } from '@emotion/react';
import { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            color: white;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen;
          }
        `}
      />

      <Component {...pageProps} />
    </>
  );
}
export default App;
