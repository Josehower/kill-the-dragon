import { useTexture } from '@react-three/drei';
import { MeshProps, useFrame } from '@react-three/fiber';
import { MutableRefObject, RefObject, useRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { gameMapEvents } from '../../database/maps/mapEvents';
import { isInsideTile } from '../../utils/colliders';
import { createTileTextureAnimator } from '../../utils/tiles';

export default function Sprite({
  spriteSheet,
  position,
  tileSize,
  args,
  frameNumber,
  ...props
}: {
  spriteSheet: string;
  tileSize: [number, number] | number;
  position?: [number, number, number] | Vector3;
  args: [number | undefined, number | undefined, number | undefined];
  frameNumber: number;
}) {
  const texture = useTexture(spriteSheet);

  texture.magFilter = THREE.NearestFilter;

  const animator = createTileTextureAnimator(texture, tileSize);

  animator(frameNumber);

  return (
    <sprite {...props} position={position}>
      <planeGeometry args={args} />
      <spriteMaterial map={texture} />
    </sprite>
  );
}

export function Npc({
  spriteSheet,
  imageSize,
  position,
  argsValue,
  eventIdQueueRef,
  characterRef,
  onCollitionEventIds,
  collidingSpots = [],
  frameNumber = 0,
  ...props
}: MeshProps & {
  spriteSheet: string;
  position: [number, number, number] | Vector3;
  imageSize: [number, number] | number;
  argsValue: [number | undefined, number | undefined, number | undefined];
  characterRef: RefObject<THREE.Sprite>;
  onCollitionEventIds: typeof gameMapEvents[number]['id'][];
  collidingSpots?: [number, number][];
  eventIdQueueRef: MutableRefObject<number[]>;
  frameNumber?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
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
    <mesh ref={meshRef} {...props}>
      <Sprite
        spriteSheet={spriteSheet}
        tileSize={imageSize}
        position={position}
        args={argsValue}
        frameNumber={frameNumber}
      />
    </mesh>
  );
}
