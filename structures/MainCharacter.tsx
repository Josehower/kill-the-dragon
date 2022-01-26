import { Color, MeshProps, useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import * as three from 'three';

export default function Sprite({
  tileRef,
  position,
  color,
  ...props
}: {
  position: MeshProps['position'];
  tileRef: MutableRefObject<three.Sprite | undefined>;
  color?: Color;
}) {
  return (
    <sprite ref={tileRef} {...props} position={position}>
      <planeGeometry />
      <meshStandardMaterial color={color} />
    </sprite>
  );
}

export function MainCharacter({
  charRef,
  lastPosition,
  isCharacterFreezed,
  ...props
}: MeshProps & {
  charRef: MutableRefObject<three.Sprite | undefined>;
  lastPosition?: { x: number; y: number };
  isCharacterFreezed: boolean;
}) {
  return (
    <mesh {...props} onClick={() => console.log('click')}>
      <Sprite
        position={
          lastPosition ? [lastPosition.x, lastPosition.y, 0] : [0, 0, 0]
        }
        tileRef={charRef}
        color={'blue'}
      />
    </mesh>
  );
}
