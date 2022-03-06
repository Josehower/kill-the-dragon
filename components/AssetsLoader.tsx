import { useTexture } from '@react-three/drei';
import React, { createContext } from 'react';
import * as THREE from 'three';

export const textureContext = createContext<{
  assets: THREE.Texture | THREE.Texture[] | undefined;
}>({ assets: undefined });

export default function AssetsLoader({
  texturePath,
  ...props
}: {
  texturePath: string | string[];
} & { children?: React.ReactNode }) {
  const assets = useTexture(texturePath);

  const contextValue = { assets };

  return (
    <textureContext.Provider value={contextValue}>
      {props.children}
    </textureContext.Provider>
  );
}
