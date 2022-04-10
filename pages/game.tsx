import { css } from '@emotion/react';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import GameObject from '../components/GameObject';
import { MainCharacter } from '../components/structures/MainCharacter';
import { MapComponent } from '../components/structures/MapComponent';
import { maps, MapSlug } from '../database/maps';

export function LoadingScreen() {
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: start;
        align-items: end;
        background-color: 'red';
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
  const currentMap = useRef(MapSlug.town);
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
        <GameObject />
        <Suspense fallback={<LoadingScreen />}>
          <Suspense fallback={null}>
            <MainCharacter currentMapRef={currentMap} />
            <MapComponent slug={MapSlug.test} stateRef={currentMap} />
            <MapComponent slug={MapSlug.town} stateRef={currentMap} />
            <MapComponent slug={MapSlug.store} stateRef={currentMap} />
          </Suspense>
        </Suspense>
      </Canvas>
    </div>
  );
}
