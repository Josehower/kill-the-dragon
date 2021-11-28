import { css } from '@emotion/react';
import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useContext } from 'react';
import BattleControl from '../components/BattleControl';
import Menu from '../components/Menu';
import Store from '../components/Store';
import { partyContext, PartyContextType } from './_app';

const canvas = css`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

export default function Refactor() {
  const partyContextValue = useContext(partyContext) as PartyContextType;
  return (
    <div css={canvas}>
      <Canvas
        camera={{
          position: [0, 0, 32],
          zoom: 90,
          near: 0.1,
          far: 64,
        }}
        orthographic
        gl={{ alpha: false, antialias: false }}
      >
        <Html fullscreen>
          <partyContext.Provider value={partyContextValue}>
            <>
              <hr />
              <hr />
              <h2>Menu</h2>
              <Store />
              <Menu />

              <h2>Go to Combat</h2>
              <BattleControl />
            </>
          </partyContext.Provider>
        </Html>

        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
      </Canvas>
    </div>
  );
}
