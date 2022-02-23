import { useTexture } from '@react-three/drei';
import { Color, MeshProps } from '@react-three/fiber';
import { MutableRefObject, Suspense } from 'react';
import * as THREE from 'three';

export default function Sprite({
  tileRef,
  position,
  color,
  ...props
}: {
  position: MeshProps['position'];
  tileRef: MutableRefObject<THREE.Sprite | undefined>;
  color?: Color;
}) {
  const texture = useTexture('/tile-sets/hero.png');

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / 6, 1 / 4);
  // texture.offset.x = 0 / 6;
  // texture.offset.y = 3 / 4;
  texture.magFilter = THREE.NearestFilter;
  return (
    <sprite ref={tileRef} {...props} position={position}>
      <planeGeometry args={[1, 2]} />
      <spriteMaterial map={texture} />
    </sprite>
  );
}

export function MainCharacter({
  charRef,
  lastPosition,
  isCharacterFreezed,
  ...props
}: MeshProps & {
  charRef: MutableRefObject<THREE.Sprite | undefined>;
  lastPosition?: { x: number; y: number };
  isCharacterFreezed: boolean;
}) {
  return (
    <Suspense fallback={null}>
      <mesh {...props} onClick={() => console.log('click')}>
        <Sprite
          position={
            lastPosition ? [lastPosition.x, lastPosition.y, 0] : [0, 0, 0]
          }
          tileRef={charRef}
          color="blue"
        />
      </mesh>
    </Suspense>
  );
}
