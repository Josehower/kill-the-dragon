import { useTexture } from '@react-three/drei';
import { Color, MeshProps, useFrame } from '@react-three/fiber';
import { MutableRefObject, Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import useControls from '../../hooks/useControls';
import {
  createLoopAnimation,
  createScriptAnimation,
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

  // let on = false;
  // let onSpin = false;
  // let startSpin = false;

  // let another = false;
  // let last = 0;
  // const spinAndDash = async () => {
  //   if (!startSpin) return;
  //   if (another) {
  //     charRef.current.position.x -= 0.06;
  //   }
  //   if (animator && !onSpin) {
  //     onSpin = true;
  //     animator(0);
  //     await wait(150);
  //     animator(6);
  //     await wait(150);
  //     animator(12);
  //     await wait(150);
  //     animator(18);
  //     animator(0);
  //     await wait(100);
  //     animator(6);
  //     await wait(100);
  //     animator(12);
  //     await wait(100);
  //     animator(18);
  //     await wait(100);
  //     charRef.current.position.x += 3;
  //     animator(21);
  //     await wait(60);
  //     animator(22);
  //     last = charRef.current.position.x;
  //     another = true;
  //     await wait(60);
  //     animator(23);
  //     await wait(60);
  //     animator(22);
  //     await wait(60);
  //     another = false;
  //     animator(21);
  //     await wait(20);
  //     animator(6);
  //     await wait(20);
  //     animator(12);
  //     await wait(20);
  //     animator(18);
  //     await wait(50);
  //     charRef.current.position.x = last - 3;
  //     onSpin = false;
  //     startSpin = false;
  //   }
  // };

  useEffect(() => {
    console.log('load');
  }, [charRef]);

  useFrame((clock, d) => {
    if (!charRef.current?.material.map) return;

    if (!runRight) {
      runRight = createLoopAnimation(charRef.current, [20, 21, 22, 23], {
        tileSize: [32, 64],
        speed: 120,
        moveX: 0.05,
      });
    }

    if (!runLeft) {
      runLeft = createLoopAnimation(charRef.current, [14, 15, 16, 17], {
        tileSize: [32, 64],
        speed: 120,
        moveX: -0.05,
      });
    }
    if (!runUp) {
      runUp = createLoopAnimation(charRef.current, [8, 9, 10, 11], {
        tileSize: [32, 64],
        speed: 120,
        moveY: 0.05,
      });
    }
    if (!runDown) {
      runDown = createLoopAnimation(charRef.current, [2, 3, 4, 5], {
        tileSize: [32, 64],
        speed: 120,
        moveY: -0.05,
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
      spin = createScriptAnimation(
        charRef.current,
        [
          { tileid: 0, duration: 100, moveX: 0.05 },
          { tileid: 6, duration: 80, moveX: 0.05 },
          { tileid: 12, duration: 110, moveX: 0.05 },
          { tileid: 18, duration: 150, moveX: 0.05, portX: 1.5 },
          { tileid: 0, duration: 180, moveX: -0.05 },
          { tileid: 0, duration: 180, moveX: 0.05 },
          { tileid: 0, duration: 180, moveX: -0.05 },
          { tileid: 0, duration: 180, moveX: 0.05 },
          { tileid: 6, duration: 200, moveX: -0.05 },
          { tileid: 12, duration: 250, moveX: -0.05, portX: -1.5 },
          { tileid: 18, duration: 400 },
        ],
        {
          tileSize: [32, 64],
        },
      );
    }

    // if (charRef.current) {
    //   charRef.current.position.x +=
    //     Math.sin(clock.clock.getElapsedTime() * 5) * 0.08;

    //   if (Math.sin(clock.clock.getElapsedTime() * 5) > 0) {
    //     runRight(d);
    //   } else {
    //     runLeft(d);
    //   }
    // }

    // spinAndDash();
    // if (controls.current.jump && !onSpin) {
    //   startSpin = true;
    // }

    // charRef.current.position.x += 0.05;
    runRight(d, controls.current.right);
    runLeft(d, controls.current.left);
    runUp(d, controls.current.forward);
    runDown(d, controls.current.backward);

    spin(d, controls.current.jump);

    // if (controls.current.left && !on) {
    //   startLeft = true;
    // }

    if (
      !controls.current.right &&
      !controls.current.left &&
      !controls.current.forward &&
      !controls.current.backward &&
      !controls.current.jump
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

// Existen diferentes tipos de animaciones, la manera mas natural en r3f es ponerlas en el gameLoop, lo que las hace necesitar ser resilientes a multiples llamados consecutivos.

// Loop anomations. Necesitan de un regulador de frame (basado en delta o en clockElapsedTime)

// animaciones de desplazamiento. necesitan accesso al delta para funcionar fluidas.

// temporales de un solo sentido no necesitan el delta y exponen la variable activacion para saber cuando cominezan y cuando terminan.

// animaciones necesitan closures privados, y otros expuestos (animacionOn y arranque)

// Hay animaciones que se pueden interpolar es decir hay jerarquias de animaciones. por ejemplo en la animacion movimiento se mueve el sprite y se activa una animacion de loop, pero yo puedo querer lanzar en spin y seguir aplicando el movimiento.

// spin Prioridad 1
// movimiento Prioridad 2 (si spin se activa seguir movimiento pero parar loop)

// [
//   {
//    "duration":100,
//    "tileid":252
//   },
//   {
//    "duration":100,
//    "tileid":251
//   },
//   {
//    "duration":100,
//    "tileid":250
//   },
//   {
//    "duration":100,
//    "tileid":249
//   },
//   {
//    "duration":100,
//    "tileid":248
//   }],
