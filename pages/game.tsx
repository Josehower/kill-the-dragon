import { css } from '@emotion/react';
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import GameObject from '../components/GameObject';
import { maps } from '../database/maps';
import { BaseFloor } from '../structures/BaseFloor';

// export const textureContext = createContext<{
//   texture: THREE.Texture | undefined;
// }>({ texture: undefined });

export function LoadingScreen() {
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: start;
        align-items: end;
      `}
    >
      <div
        css={css`
          font-size: 30px;
          :hover {
            transform: scale(1.2);
            cursor: pointer;
          }
        `}
      >
        Loading...
      </div>
    </div>
  );
}

const canvas = css`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

export default function Game() {
  const currentMap = useRef(maps[0]);
  console.log('canvas render');
  return (
    <div css={canvas}>
      <Canvas
        camera={{
          position: [0, 0, 1],
          zoom: 70,
          near: 0.1,
          far: 64,
        }}
        orthographic
        gl={{ alpha: false, antialias: false }}
      >
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {/* <AssetsLoader> */}
        <GameObject mapRef={currentMap} />
        <Suspense fallback={<LoadingScreen />}>
          <Suspense fallback={null}>
            <BaseFloor map={maps[0]} mapRef={currentMap} />
            <BaseFloor map={maps[1]} mapRef={currentMap} />
          </Suspense>
        </Suspense>
      </Canvas>
    </div>
  );
}
