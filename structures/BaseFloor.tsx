import { Color, MeshProps, useFrame, Vector3 } from '@react-three/fiber';
import { Dispatch, SetStateAction } from 'react';
import { Encounter } from '../database/encounters';
import { GameMap } from '../database/maps';
import { gridGenerator } from '../utils/map';

function Tile({
  pos = [0, 0, 0],
  color = 'red',
  ...props
}: {
  pos: Vector3;
  color: Color;
  props?: MeshProps;
}) {
  return (
    <sprite {...props} position={pos}>
      <planeGeometry />
      <meshStandardMaterial color={color} />
    </sprite>
  );
}

export function BaseFloor({
  map,
  setEncounter,
  ...props
}: {
  map: GameMap;
  setEncounter: Dispatch<SetStateAction<Encounter | null>>;
  props?: MeshProps;
}) {
  const size = map.width;
  const grid = gridGenerator(size, map.height);

  let isOff = true;
  useFrame(() => {
    if (isOff) {
      isOff = false;
    }
  });

  return (
    <mesh {...props} onClick={() => console.log('click')}>
      {grid.map(([x, y]) => {
        const centeredX = x - size / 2;
        const centeredY = y + 4 - size / 2;
        if (
          map.locations.some(
            (location) => location.x === centeredX && location.y === centeredY,
          )
        ) {
          return <Tile pos={[centeredX, centeredY, -1]} color="purple" />;
        }
        return (
          <Tile
            key={`${x}-${y}`}
            pos={[centeredX, centeredY, -1]}
            color={(centeredX + centeredY) % 2 ? 'white' : 'green'}
          />
        );
      })}
    </mesh>
  );
}
