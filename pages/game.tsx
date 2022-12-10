import { css } from '@emotion/react';
import { Html, useProgress } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { MutableRefObject, Suspense, useRef } from 'react';
import DomBasedComponent from '../components/structures/DomBasedComponent';
import { MainCharacter } from '../components/structures/MainCharacter';
import { MapComponent } from '../components/structures/MapComponent';
import { Npc } from '../components/structures/Npc';
import { GameDialog } from '../database/dialogs';
import { Encounter } from '../database/encounters';
import { MapSlug } from '../database/maps/mapList';

function MyLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <h1
        css={css`
          color: white;
          background-color: red;
          width: 100vw;
          height: 100vh;
        `}
      >
        {progress} % loaded{' '}
      </h1>
    </Html>
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
  const characterRef = useRef<THREE.Sprite>(null);
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
          zoom: 0.1,
        }}
        gl={{ alpha: false, antialias: false }}
      >
        <Suspense fallback={<MyLoader />}>
          <Dolly />
          <DomBasedComponent
            encounterRef={encounterRef}
            promptDialogRef={promptDialogRef}
            isCharacterFreezed={isCharacterFreezed}
            toggleStoreRef={toggleStoreRef}
            toggleMenuRef={toggleMenuRef}
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
                <>
                  {mapSlug === MapSlug.store ? (
                    <Npc
                      spriteSheet="/tile-sets/npc/taur-walk.png"
                      position={[1, 4, 0]}
                      imageSize={128}
                      argsValue={[3, 3, undefined]}
                      characterRef={characterRef}
                      onCollitionEventIds={[3]}
                      collidingSpots={[[0, 3]]}
                      eventIdQueueRef={eventIdQueueRef}
                      frameNumber={6}
                    />
                  ) : undefined}
                  {mapSlug === MapSlug.dragon ? (
                    <>
                      <Npc
                        spriteSheet="/tile-sets/creatures/dragon.png"
                        position={[-9, -2, 0]}
                        imageSize={[192, 124]}
                        argsValue={[10, 6, undefined]}
                        characterRef={characterRef}
                        onCollitionEventIds={[8]}
                        collidingSpots={[
                          [-5, -7],
                          [-5, -6],
                          [-5, -5],
                          [-5, -4],
                          [-5, -3],
                          [-5, -2],
                          [-5, -1],
                          [-4, -1],
                        ]}
                        eventIdQueueRef={eventIdQueueRef}
                      />
                      <Npc
                        spriteSheet="/tile-sets/creatures/cockatrice.png"
                        position={[0, -3, 0]}
                        imageSize={[60, 90]}
                        argsValue={[2, 3, undefined]}
                        characterRef={characterRef}
                        onCollitionEventIds={[7]}
                        collidingSpots={[[0, -4]]}
                        eventIdQueueRef={eventIdQueueRef}
                      />
                      <Npc
                        spriteSheet="/tile-sets/creatures/wolf-60x60.png"
                        position={[6, -3.3, 0]}
                        imageSize={[60, 60]}
                        argsValue={[2, 2, undefined]}
                        characterRef={characterRef}
                        onCollitionEventIds={[6]}
                        collidingSpots={[[6, -4]]}
                        eventIdQueueRef={eventIdQueueRef}
                      />
                    </>
                  ) : undefined}
                </>
              </MapComponent>
            ),
          )}
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
        </Suspense>
      </Canvas>
    </div>
  );
}
