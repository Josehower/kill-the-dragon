import { useTexture } from '@react-three/drei';
import { Color, MeshProps, useFrame } from '@react-three/fiber';
import { MutableRefObject, Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import useControls from '../../hooks/useControls';
import { SpriteAnimationHandler } from '../../types/tiled';
import {
  createSpriteAnimation,
  createTileTextureAnimator,
} from '../../utils/tiles';

export default function Sprite({
  tileRef,
  ...props
}: {
  position: MeshProps['position'];
  tileRef: MutableRefObject<THREE.Sprite | undefined>;
  color?: Color;
}) {
  const texture = useTexture('/tile-sets/hero.png');
  texture.magFilter = THREE.NearestFilter;

  const animator = createTileTextureAnimator(texture, [32, 64]);

  animator(18);

  return (
    <sprite ref={tileRef} {...props} position={[0, 0, 0]}>
      <planeGeometry args={[1, 2]} />
      <spriteMaterial map={texture} />
    </sprite>
  );
}

export function MainCharacter({
  lastPosition,
  isCharacterFreezed,
  ...props
}: MeshProps & {
  lastPosition?: { x: number; y: number };
  isCharacterFreezed: boolean;
}) {
  const controls = useControls();

  const charRef = useRef<THREE.Sprite>();
  const animationsRef = useRef<{
    runRight?: SpriteAnimationHandler;
    runLeft?: SpriteAnimationHandler;
    runUp?: SpriteAnimationHandler;
    runDown?: SpriteAnimationHandler;
    spin?: SpriteAnimationHandler;
  }>({});
  const animatorRef = useRef<{
    animator?: (value: number) => void;
  }>({});

  useFrame((clock, d) => {
    if (!charRef.current || !charRef.current.material.map) return;

    if (!animationsRef.current.runRight) {
      animationsRef.current.runRight = createSpriteAnimation(
        charRef.current,
        [20, 21, 22, 23],
        {
          tileSize: [32, 64],
          frameDuration: 120,
          constantMove: { x: 0.05 },
        },
      );
    }

    if (!animationsRef.current.runLeft) {
      animationsRef.current.runLeft = createSpriteAnimation(
        charRef.current,
        [14, 15, 16, 17],
        {
          tileSize: [32, 64],
          frameDuration: 120,
          constantMove: { x: -0.05 },
        },
      );
    }
    if (!animationsRef.current.runUp) {
      animationsRef.current.runUp = createSpriteAnimation(
        charRef.current,
        [8, 9, 10, 11],
        {
          tileSize: [32, 64],
          frameDuration: 120,
          constantMove: { y: 0.05 },
        },
      );
    }
    if (!animationsRef.current.runDown) {
      animationsRef.current.runDown = createSpriteAnimation(
        charRef.current,
        [2, 3, 4, 5],
        {
          tileSize: [32, 64],
          frameDuration: 120,
          constantMove: { y: -0.05 },
        },
      );
    }

    if (!animatorRef.current.animator) {
      animatorRef.current.animator = createTileTextureAnimator(
        charRef.current.material.map,
        [32, 64],
      );
      return;
    }

    if (!animationsRef.current.spin) {
      animationsRef.current.spin = createSpriteAnimation(
        charRef.current,
        [
          { duration: 50, move: { x: 0.05 } },
          { duration: 800, move: { x: 0.05 } },
          { duration: 80, move: { x: 0.05 } },
          { duration: 110, move: { x: 0.05 } },
          { duration: 150, move: { x: 0.05 } },
          { tileid: 0, duration: 180, move: { x: -0.05 }, port: { x: 1.05 } },
          { tileid: 0, duration: 180, move: { x: 0.05 }, port: { x: 100.05 } },
          { tileid: 0, duration: 180, port: { x: -100.05 } },
          { tileid: 0, duration: 180, move: { x: 0.05 } },
          { tileid: 6, duration: 200, move: { x: -0.05 }, port: { x: -1.05 } },
          { tileid: 12, duration: 250, move: { x: -0.05 } },
          { tileid: 18, duration: 400 },
        ],
        {
          tileSize: [32, 64],
          constantMove: { y: -0.005 },
          type: 'single onPress',
        },
      );
    }

    animationsRef.current.runRight(d, controls.current.right);
    animationsRef.current.runLeft(d, controls.current.left);
    animationsRef.current.runUp(d, controls.current.forward);
    animationsRef.current.runDown(d, controls.current.backward);

    const on = animationsRef.current.spin(d, controls.current.jump);
    console.log(on);

    if (
      !controls.current.right &&
      !controls.current.left &&
      !controls.current.forward &&
      !controls.current.backward &&
      !controls.current.jump &&
      !on
    ) {
      animatorRef.current.animator(0);
    }
  });
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
