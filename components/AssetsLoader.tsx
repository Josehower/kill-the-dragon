import { useTexture } from '@react-three/drei';
import { createContext } from 'react';
import * as THREE from 'three';

// CHECK: Not used yet

// import { textureContext } from '../pages/game';

const textureContext = createContext<{
  texture: THREE.Texture | undefined;
}>({ texture: undefined });
// console.log('%c loader 1! ', 'background: black; color: #bada55');

export default function AssetsLoader(props) {
  const texture = useTexture('/tile-sets/tile-set-images/cave-entrance.png');

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / 16, 1 / 16);
  texture.offset.x = 15 / 16;
  const contextValue = { texture };

  return (
    <textureContext.Provider value={contextValue}>
      {props.children}
    </textureContext.Provider>
  );
}
