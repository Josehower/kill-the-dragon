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
            background-color: #000008;
            color: #ededee;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen;

            a {
              text-decoration: none;
              :visited {
                color: #e6dbae;
              }
            }
          }
        `}
      />

      <Component {...pageProps} />
    </>
  );
}
export default App;
