import { css } from '@emotion/react';
import { Canvas } from '@react-three/fiber';
import GameObject from '../components/GameObject';

const canvas = css`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

export default function Game() {
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
        <GameObject />
      </Canvas>
    </div>
  );
}
