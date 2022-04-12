import { useTexture } from '@react-three/drei';
import { Color, MeshProps, useFrame } from '@react-three/fiber';
import { klona } from 'klona';
import {
  MutableRefObject,
  Suspense,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import * as THREE from 'three';
import { GameDialog } from '../../database/dialogs';
import { Encounter } from '../../database/encounters';
import { gameMapEvents } from '../../database/maps/mapEvents';
import { MapSlug } from '../../database/maps/mapList';
import useControls from '../../hooks/useControls';
import { JsonMap, SpriteAnimationHandler } from '../../types/tiled';
import { isInsideTile } from '../../utils/colliders';
import { gridGenerator } from '../../utils/map';
import {
  createSpriteAnimation,
  createTileTextureAnimator,
} from '../../utils/tiles';

export default function Sprite({
  tileRef,
  ...props
}: {
  tileRef: MutableRefObject<THREE.Sprite | undefined>;
  color?: Color;
}) {
  const texture = useTexture('/tile-sets/heros/hero.png');
  texture.magFilter = THREE.NearestFilter;

  const animator = createTileTextureAnimator(texture, [32, 64]);

  animator(18);

  return (
    <sprite ref={tileRef} {...props} position={[8, -4.5, 0]}>
      <planeGeometry args={[1, 2]} />
      <spriteMaterial map={texture} />
    </sprite>
  );
}

export function MainCharacter({
  currentMapRef,
  characterRef,
  isCharacterFreezed,
  encounterRef,
  promptDialogRef,
  toggleStoreRef,
  toggleMenuRef,
  eventIdQueueRef,
  ...props
}: MeshProps & {
  currentMapRef: MutableRefObject<MapSlug>;
  characterRef: MutableRefObject<THREE.Sprite | undefined>;
  isCharacterFreezed: MutableRefObject<boolean>;
  encounterRef: MutableRefObject<Encounter | null>;
  promptDialogRef: MutableRefObject<GameDialog | null>;
  toggleStoreRef: MutableRefObject<boolean>;
  toggleMenuRef: MutableRefObject<boolean>;
  eventIdQueueRef: MutableRefObject<number[]>;
}) {
  const controls = useControls();
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

  const currentSlugRef = useRef<MapSlug>(currentMapRef.current);
  const coliders = useRef<[number, number][]>([]);

  const getJsonMapData = useCallback(async () => {
    const { default: file }: { default: JsonMap } = await import(
      `../../database/maps/${currentMapRef.current}`
    );

    const offsetX =
      file.properties &&
      (file.properties.find((prop) => prop.name === 'offsetX') as
        | {
            name: 'offsetX';
            type: 'int';
            value: number;
          }
        | undefined);

    const offsetY =
      file.properties &&
      (file.properties.find((prop) => prop.name === 'offsetY') as
        | {
            name: 'offsetY';
            type: 'int';
            value: number;
          }
        | undefined);

    const layerGrid = gridGenerator(
      file.width,
      file.height,
      // if one offset is undefined it pass 0 as value
      offsetX || offsetY
        ? [offsetX?.value ?? 0, offsetY?.value ?? 0]
        : undefined,
    );

    currentSlugRef.current = currentMapRef.current;

    coliders.current = layerGrid
      .map(([x, y], index) => {
        const mapTileValue = file.layers.find(
          (layer) => layer.name === 'colliders',
        );
        if (mapTileValue && mapTileValue.data[index] > 0) {
          return [x - file.width / 2, y - file.height / 2];
        }

        return null;
      })
      .filter((cell) => cell !== null) as [number, number][];
  }, [currentMapRef]);

  useEffect(() => {
    getJsonMapData().catch(() => {});
  }, [getJsonMapData]);

  useFrame(() => {
    if (
      !isCharacterFreezed.current &&
      !encounterRef.current &&
      !promptDialogRef.current &&
      !toggleStoreRef.current &&
      !toggleMenuRef.current
    ) {
      const eventId = eventIdQueueRef.current.shift();

      if (eventId === undefined) return;

      gameMapEvents[eventId].handler({
        characterRef: characterRef as MutableRefObject<THREE.Sprite>,
        currentMapRef,
        promptDialogRef: promptDialogRef,
        encounterRef,
        toggleStoreRef,
        toggleMenuRef,
      });
    }
  });

  useFrame((clock, d) => {
    if (!characterRef.current || !characterRef.current.material.map) return;

    if (encounterRef.current) {
      characterRef.current.position.z = 2;
      return;
    } else {
      characterRef.current.position.z = 0;
    }

    if (currentMapRef.current !== currentSlugRef.current) {
      getJsonMapData().catch(() => {});
      return;
    }

    if (isCharacterFreezed.current) return;

    const startPos = klona(characterRef.current.position);

    if (!animatorRef.current.animator) {
      animatorRef.current.animator = createTileTextureAnimator(
        characterRef.current.material.map,
        [32, 64],
      );
      return;
    }

    if (!animationsRef.current.runRight) {
      animationsRef.current.runRight = createSpriteAnimation(
        characterRef.current,
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
        characterRef.current,
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
        characterRef.current,
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
        characterRef.current,
        [2, 3, 4, 5],
        {
          tileSize: [32, 64],
          frameDuration: 120,
          constantMove: { y: -0.05 },
        },
      );
    }

    if (!animationsRef.current.spin) {
      animationsRef.current.spin = createSpriteAnimation(
        characterRef.current,
        [
          { tileid: 3, duration: 500, move: { x: 0.05 } },
          { duration: 800, move: { x: 0.05 } },
          { duration: 80, move: { x: 0.05 } },
          { duration: 110, move: { x: 0.05 } },
          { duration: 150, move: { x: 0.05 } },
          { tileid: 0, duration: 180, move: { x: -0.05 } },
          { tileid: 0, duration: 180, move: { x: 0.05 }, port: { x: 100.05 } },
          { tileid: 0, duration: 180, port: { x: -100.05 } },
          { tileid: 0, duration: 180, move: { x: 0.05 } },
          { tileid: 6, duration: 200, move: { x: -0.05 } },
          { tileid: 12, duration: 250, move: { x: -0.05 } },
          { tileid: 18, duration: 400 },
        ],
        {
          tileSize: [32, 64],
          constantMove: { y: -0.005 },
          type: 'single',
          quickStart: true,
        },
      );
    }

    const spinning = animationsRef.current.spin(d, controls.current.jump);

    const runningUp = animationsRef.current.runUp(
      d,
      !spinning && controls.current.forward,
    );

    const runningRight = animationsRef.current.runRight(
      d,
      !spinning && controls.current.right,
    );

    const runningDown = animationsRef.current.runDown(
      d,
      !spinning && controls.current.backward,
    );

    const runningLeft = animationsRef.current.runLeft(
      d,
      !spinning && controls.current.left,
    );

    if (
      !runningRight &&
      !runningLeft &&
      !runningUp &&
      !runningDown &&
      !spinning
    ) {
      animatorRef.current.animator(0);
    }

    const endPosition = klona(characterRef.current.position);

    const collition = coliders.current;

    const topLeft = [endPosition.x - 0.3, endPosition.y - 0.2];
    const topRight = [endPosition.x + 0.3, endPosition.y - 0.2];
    const bottomLeft = [endPosition.x - 0.3, endPosition.y - 0.8];
    const bottomRight = [endPosition.x + 0.3, endPosition.y - 0.8];

    const topLeftCollition = collition.some((vector) =>
      isInsideTile(vector, topLeft as [number, number]),
    );

    const topRightCollition = collition.some((vector) =>
      isInsideTile(vector, topRight as [number, number]),
    );

    const bottomLeftCollition = collition.some((vector) =>
      isInsideTile(vector, bottomLeft as [number, number]),
    );

    const bottomRightCollition = collition.some((vector) =>
      isInsideTile(vector, bottomRight as [number, number]),
    );

    const colliding =
      topLeftCollition ||
      topRightCollition ||
      bottomRightCollition ||
      bottomLeftCollition;

    if (colliding) {
      characterRef.current.position.x = startPos.x;
      characterRef.current.position.y = startPos.y;
    }
  });
  return (
    <Suspense fallback={null}>
      <mesh {...props} onClick={() => console.log('click')}>
        <Sprite tileRef={characterRef} />
      </mesh>
    </Suspense>
  );
}
