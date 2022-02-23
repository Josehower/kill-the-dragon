import { css } from '@emotion/react';
import { useCamera } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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

function Dolly() {
  // This one makes the camera move in and out
  const state = useThree();
  state.camera.position.x = -0.5;

  return null;
}

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
        <Dolly />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {/* <AssetsLoader> */}
        <GameObject mapRef={currentMap} />
        <Suspense fallback={<LoadingScreen />}>
          <Suspense fallback={null}>
            <BaseFloor
              path="/tile-sets/tile-set-images/wood_tileset47.png"
              map={maps[0]}
              set={0}
              mapRef={currentMap}
            />
            <BaseFloor
              path="/tile-sets/tile-set-images/mountain_house.png"
              map={maps[0]}
              set={1}
              mapRef={currentMap}
            />
            <BaseFloor
              path="/tile-sets/tile-set-images/wood_tileset47.png"
              map={maps[1]}
              set={0}
              mapRef={currentMap}
            />
          </Suspense>
        </Suspense>
      </Canvas>
    </div>
  );
}
