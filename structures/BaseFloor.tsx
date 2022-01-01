import { MeshProps, useFrame } from '@react-three/fiber';
import { gridGenerator } from '../utils/map';

export default function Tile({ pos = [0, 0, 0], color = 'red', ...props }) {
  return (
    <sprite {...props} position={pos}>
      <planeGeometry />
      <meshStandardMaterial color={color} />
    </sprite>
  );
}

export function BaseFloor(props: MeshProps) {
  const size = 18;
  const grid = gridGenerator(size, 10);

  let isOff = true;
  useFrame(e => {
    if (isOff) {
      console.log(e);
      isOff = false;
    }
  });

  return (
    <mesh {...props} onClick={() => console.log('click')}>
      {grid.map(([x, y]) => {
        const centeredX = x - size / 2;
        const centeredY = y + 4 - size / 2;
        if (centeredX === -5 && centeredY === 2) {
          return <Tile pos={[centeredX, centeredY, 0]} color={'purple'} />;
        }
        return (
          <Tile
            pos={[centeredX, centeredY, 0]}
            color={(centeredX + centeredY) % 2 ? 'white' : 'green'}
          />
        );
      })}
    </mesh>
  );
}
