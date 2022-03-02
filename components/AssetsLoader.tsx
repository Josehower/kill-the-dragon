import { useTexture } from '@react-three/drei';
import React, { createContext } from 'react';
import * as THREE from 'three';

// CHECK: Not used yet

// import { textureContext } from '../pages/game';

export const textureContext = createContext<{
  texture: THREE.Texture | THREE.Texture[] | undefined;
}>({ texture: undefined });
// console.log('%c loader 1! ', 'background: black; color: #bada55');

export default function AssetsLoader({
  texturePath,
  ...props
}: {
  texturePath: string | string[];
} & { children?: React.ReactNode }) {
  // console.log(texturePath);
  const texture = useTexture(texturePath);

  // console.log(texture.image.width / 32);
  // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // texture.repeat.set(1 / 16, 1 / 16);
  // texture.offset.x = 0 / 16;
  // texture.offset.y = 10 / 16;
  // texture.magFilter = THREE.NearestFilter;
  // texture.format = THREE.RGBAFormat;
  // texture.minFilter = THREE.NearestFilter;

  // texture.magFilter = THREE.LinearFilter;
  // console.log(texture.map((tx) => tx.image.src));

  const contextValue = { texture };

  return (
    <textureContext.Provider value={contextValue}>
      {props.children}
    </textureContext.Provider>
  );
}