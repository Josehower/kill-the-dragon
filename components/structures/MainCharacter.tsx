import { useTexture } from '@react-three/drei';
import { Color, MeshProps, useFrame } from '@react-three/fiber';
import { MutableRefObject, Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import useControls from '../../hooks/useControls';
import {
  createLoopAnimation,
  createScriptAnimation,
  createSpriteAnimation,
  createTileTextureAnimator,
  tiledToR3FTextureTranspiler,
} from '../../utils/tiles';
// import { wait } from '../../utils/wait';

export default function Sprite({
  tileRef,
  ...props
}: {
  position: MeshProps['position'];
  tileRef: MutableRefObject<THREE.Sprite | undefined>;
  color?: Color;
}) {
  const texture = useTexture('/tile-sets/hero.png');

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const { offset, repeat } = tiledToR3FTextureTranspiler(18, texture, [32, 64]);

  texture.repeat.set(repeat.x, repeat.y);
  texture.offset.x = offset.x;
  texture.offset.y = offset.y;

  texture.magFilter = THREE.NearestFilter;
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

  const charRef = useRef<MutableRefObject<THREE.Sprite | undefined>>();

  let animator;

  let runRight;

  let runLeft;

  let runUp;

  let runDown;

  let spin;

  useEffect(() => {
    console.log('load');
  }, [charRef]);

  useFrame((clock, d) => {
    if (!charRef.current?.material.map) return;

    if (!runRight) {
      runRight = createSpriteAnimation(charRef.current, [20, 21, 22, 23], {
        tileSize: [32, 64],
        frameDuration: 120,
        constantMove: { x: 0.05 },
      });
    }

    if (!runLeft) {
      runLeft = createSpriteAnimation(charRef.current, [14, 15, 16, 17], {
        tileSize: [32, 64],
        frameDuration: 120,
        constantMove: { x: -0.05 },
      });
    }
    if (!runUp) {
      runUp = createSpriteAnimation(charRef.current, [8, 9, 10, 11], {
        tileSize: [32, 64],
        frameDuration: 120,
        constantMove: { y: 0.05 },
      });
    }
    if (!runDown) {
      runDown = createSpriteAnimation(charRef.current, [2, 3, 4, 5], {
        tileSize: [32, 64],
        frameDuration: 120,
        constantMove: { y: -0.05 },
      });
    }

    if (!animator) {
      animator = createTileTextureAnimator(
        charRef.current.material.map,
        [32, 64],
      );
      return;
    }

    if (!spin) {
      spin = createSpriteAnimation(
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

    runRight(d, controls.current.right);
    runLeft(d, controls.current.left);
    runUp(d, controls.current.forward);
    runDown(d, controls.current.backward);

    const on = spin(d, controls.current.jump);
    console.log(on);

    if (
      !controls.current.right &&
      !controls.current.left &&
      !controls.current.forward &&
      !controls.current.backward &&
      !controls.current.jump &&
      !on
    ) {
      animator(0);
      // charRef.current.position.x = Math.floor(charRef.current.position.x) + 0.5;
      // charRef.current.position.y = Math.floor(charRef.current.position.y) + 0.5;
    }

    // console.log(d);
    // check clock get elapsed time
    // https://codesandbox.io/s/getting-started-01-forked-qnbqio?file=/src/App.js
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
