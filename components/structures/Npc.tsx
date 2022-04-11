import { useTexture } from '@react-three/drei';
import { MeshProps, useFrame } from '@react-three/fiber';
import { MutableRefObject, Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { GameDialog } from '../../database/dialogs';
import { Encounter } from '../../database/encounters';
import { gameMapEvents } from '../../database/maps/mapEvents';
import { MapSlug } from '../../database/maps/mapList';
import { isInsideTile } from '../../utils/colliders';
import { createTileTextureAnimator } from '../../utils/tiles';

export default function Sprite({
  spriteSheet,
  position,
  tileSize,
  args,
  ...props
}: {
  spriteSheet: string;
  tileSize: [number, number] | number;
  position?: [number, number, number] | Vector3;
  args: [number | undefined, number | undefined, number | undefined];
}) {
  const texture = useTexture(spriteSheet);

  texture.magFilter = THREE.NearestFilter;

  const animator = createTileTextureAnimator(texture, tileSize);

  animator(6);

  return (
    <sprite {...props} position={position}>
      <planeGeometry args={args} />
      <spriteMaterial map={texture} />
    </sprite>
  );
}

export function Npc({
  spriteSheet,
  tileSize,
  position,
  argsValue,
  eventIdQueueRef,
  characterRef,
  onCollitionEventIds,
  collidingSpots = [],
  ...props
}: MeshProps & {
  spriteSheet: string;
  position: [number, number, number] | Vector3;
  tileSize: [number, number] | number;
  argsValue: [number | undefined, number | undefined, number | undefined];
  characterRef: MutableRefObject<THREE.Sprite | undefined>;
  onCollitionEventIds: typeof gameMapEvents[number]['id'][];
  collidingSpots?: [number, number][];
  eventIdQueueRef: MutableRefObject<number[]>;
}) {
  const meshRef = useRef<THREE.Mesh>();
  const canCollide = useRef<boolean>(true);

  useFrame(() => {
    if (
      characterRef.current &&
      meshRef.current &&
      meshRef.current.parent &&
      meshRef.current.parent.position.z < 0
    ) {
      const topLeft = [
        characterRef.current.position.x - 0.5,
        characterRef.current.position.y,
      ];
      const topRight = [
        characterRef.current.position.x + 0.5,
        characterRef.current.position.y,
      ];
      const bottomLeft = [
        characterRef.current.position.x - 0.5,
        characterRef.current.position.y - 1,
      ];
      const bottomRight = [
        characterRef.current.position.x + 0.5,
        characterRef.current.position.y - 1,
      ];

      const topLeftCollition = collidingSpots.some((vector) =>
        isInsideTile(vector, topLeft as [number, number]),
      );

      const topRightCollition = collidingSpots.some((vector) =>
        isInsideTile(vector, topRight as [number, number]),
      );

      const bottomLeftCollition = collidingSpots.some((vector) =>
        isInsideTile(vector, bottomLeft as [number, number]),
      );

      const bottomRightCollition = collidingSpots.some((vector) =>
        isInsideTile(vector, bottomRight as [number, number]),
      );

      const colliding =
        topLeftCollition ||
        topRightCollition ||
        bottomRightCollition ||
        bottomLeftCollition;

      if (canCollide.current && colliding) {
        console.log(
          topLeftCollition,
          topRightCollition,
          bottomRightCollition,
          bottomLeftCollition,
        );
        onCollitionEventIds.forEach((eventId) =>
          eventIdQueueRef.current.push(eventId),
        );
        canCollide.current = false;
      } else if (!colliding) {
        canCollide.current = true;
      }
    }
  });

  return (
    <Suspense fallback={null}>
      <mesh ref={meshRef} {...props}>
        <Sprite
          spriteSheet={spriteSheet}
          tileSize={tileSize}
          position={position}
          args={argsValue}
        />
      </mesh>
    </Suspense>
  );
}
