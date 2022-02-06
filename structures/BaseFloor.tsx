import { useTexture } from '@react-three/drei';
import { Color, MeshProps, useFrame, Vector3 } from '@react-three/fiber';
import { createContext, MutableRefObject, Suspense, useRef } from 'react';
import * as THREE from 'three';
import { GameMap } from '../database/maps';
import { LoadingScreen } from '../pages/game';
import { gridGenerator } from '../utils/map';

const textureContext = createContext<{
  texture: THREE.Texture | undefined;
}>({ texture: undefined });

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
  mapRef,
  ...props
}: {
  map: GameMap;
  mapRef: MutableRefObject<GameMap>;
  props?: MeshProps;
}) {
  const texture = useTexture('/tile-sets/tile-set-images/cave-entrance.png');

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / 16, 1 / 16);
  texture.offset.x = 15 / 16;

  const meshRef = useRef<THREE.Mesh>();

  const contextValue = { texture };

  const size = map.width;

  const grid = gridGenerator(size, map.height);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z = mapRef.current.id === map.id ? -1 : 2;
    }
  });

  // Must be a suspense null in a parent component before the useTexture in order to work
  return (
    <textureContext.Provider value={contextValue}>
      <mesh ref={meshRef} {...props} onClick={() => console.log('click')}>
        {grid.map(([x, y]) => {
          const centeredX = x - size / 2;
          const centeredY = y + 4 - size / 2;
          if (
            map.locations.some(
              (location) =>
                location.x === centeredX && location.y === centeredY,
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
    </textureContext.Provider>
  );
}
