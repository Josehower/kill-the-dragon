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
            min-height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen;
            /* background: papayawhip; */
            /* font-family: Helvetica, Arial, sans-serif; */
          }
        `}
      />

      <Component {...pageProps} />
    </>
  );
}
export default App;
