import { css } from '@emotion/react';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { Vector3, Vector3Tuple } from 'three';
import DomBasedComponent from '../components/structures/DomBasedComponent';
import { MainCharacter } from '../components/structures/MainCharacter';
import { MapComponent } from '../components/structures/MapComponent';
import { Npc } from '../components/structures/Npc';
import { GameDialog } from '../database/dialogs';
import { Encounter } from '../database/encounters';
import { MapSlug } from '../database/maps/mapList';

export function LoadingScreen() {
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: start;
        align-items: end;
        background-color: 'red';
      `}
    >
      <div
        css={css`
          font-size: 30px;
          :hover {
            transform: scale(1.2);
            cursor: pointer;
          }
        `}
      >
        Loading...
      </div>
    </div>
  );
}

const canvas = css`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

function Dolly() {
  // This one makes the camera move in and out
  const state = useThree();
  state.camera.position.x = -0.5;

  return null;
}

export default function Game() {
  const currentMapRef = useRef(MapSlug.town);
  const characterRef = useRef<THREE.Sprite>();
  const isCharacterFreezed = useRef<boolean>(false);
  const encounterRef = useRef<Encounter | null>(null);
  const promptDialogRef = useRef<GameDialog | null>(null);
  const toggleStoreRef = useRef<boolean>(false);
  const toggleMenuRef = useRef<boolean>(false);
  const eventIdQueueRef = useRef<number[]>([]);

  return (
    <div css={canvas}>
      <Canvas
        camera={{
          position: [0, 0, 1],
          zoom: 70,
          near: 0.1,
          far: 64,
        }}
        orthographic
        gl={{ alpha: false, antialias: false }}
      >
        <Dolly />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <DomBasedComponent
          encounterRef={encounterRef}
          promptDialogRef={promptDialogRef}
          isCharacterFreezed={isCharacterFreezed}
          toggleStoreRef={toggleStoreRef}
          toggleMenuRef={toggleMenuRef}
        />
        <Suspense fallback={<LoadingScreen />}>
          <Suspense fallback={null}>
            <MainCharacter
              currentMapRef={currentMapRef}
              characterRef={characterRef}
              isCharacterFreezed={isCharacterFreezed}
              encounterRef={encounterRef}
              promptDialogRef={promptDialogRef}
              toggleStoreRef={toggleStoreRef}
              toggleMenuRef={toggleMenuRef}
              eventIdQueueRef={eventIdQueueRef}
            />

            {[MapSlug.town, MapSlug.store, MapSlug.test, MapSlug.dragon].map(
              (mapSlug) => (
                <MapComponent
                  key={mapSlug}
                  slug={mapSlug}
                  currentMapRef={currentMapRef}
                  characterRef={characterRef}
                  encounterRef={encounterRef}
                  eventIdQueueRef={eventIdQueueRef}
                >
                  {mapSlug === MapSlug.store ? (
                    <Npc
                      spriteSheet="/tile-sets/npc/taur-walk.png"
                      position={[1, 5, 0]}
                      tileSize={128}
                      argsValue={[3, 3, undefined]}
                      characterRef={characterRef}
                      onCollitionEventIds={[3]}
                      collidingSpots={[[0, 4]]}
                      eventIdQueueRef={eventIdQueueRef}
                    />
                  ) : undefined}
                </MapComponent>
              ),
            )}
          </Suspense>
        </Suspense>
      </Canvas>
    </div>
  );
}
