import { Color, MeshProps, useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import * as three from 'three';
import useControls from '../hooks/useControls';

export default function Tile({
  tileRef,
  position = [0, 0, 0],
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
  ...props
}: MeshProps & { charRef: MutableRefObject<three.Sprite | undefined> }) {
  const controls = useControls();
  // TODO: fix this this is not nice!! this should be the same ref if is decided to come from the top lvl component
  const tileRef = charRef;
  const movementSpeed = 0.07;

  useFrame(() => {
    if (!tileRef.current) return;

    if (Object.values(controls).some(c => c === true)) {
      if (controls.jump || controls.forward) {
        tileRef.current.position.y += movementSpeed;
      }
      if (controls.backward) {
        tileRef.current.position.y -= movementSpeed;
      }
      if (controls.right) {
        tileRef.current.position.x += movementSpeed;
      }
      if (controls.left) {
        tileRef.current.position.x -= movementSpeed;
      }
    }
  });

  return (
    <mesh ref={charRef} {...props} onClick={() => console.log('click')}>
      <Tile tileRef={tileRef} position={[0, 0, 0]} color={'blue'} />
    </mesh>
  );
}
