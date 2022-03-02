import { MeshProps, useFrame, Vector3 } from '@react-three/fiber';
import { MutableRefObject, useContext, useRef } from 'react';
import * as THREE from 'three';
import { GameMap } from '../../database/maps';
import { gridGenerator } from '../../utils/map';
import AssetsLoader, { textureContext } from '../AssetsLoader';

// 1 = 15, 0
// 2 = 15, 2
// 34 = 34/16 = 2.12 | (> 2 )  15 - 2, .12 / .6 = 2
// 37 = 33/16 = 2.31 | (> 2 )   15 - 2, .31/.6 = 5
const mapTest = {
  0: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 34, 34, 34,
    34, 34, 34, 0, 0, 0, 0, 0, 0, 0, 0, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34,
    34, 34, 0, 0, 0, 0, 0, 0, 0, 0, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34,
    34, 34, 0, 0, 0, 0, 0, 0, 2, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34,
    34, 0, 0, 0, 0, 0, 0, 34, 34, 3, 4, 4, 5, 34, 34, 34, 34, 34, 34, 34, 34,
    34, 0, 0, 0, 0, 34, 34, 34, 19, 20, 20, 21, 34, 34, 34, 34, 34, 34, 34, 33,
    34, 34, 34, 34, 34, 34, 34, 34, 35, 36, 36, 37, 34, 34, 34, 34, 34, 34, 34,
    34, 34, 34, 34, 34, 34, 34, 34, 52, 53, 53, 53, 53, 34, 34, 34, 34, 34, 34,
    34, 34, 34, 34, 34, 34, 34, 34, 34, 68, 0, 0, 0, 0, 34, 34, 34, 34, 34, 34,
    17, 34, 34, 33, 34, 34, 34, 34, 34, 68, 0, 0, 0, 0, 34, 34, 34, 34, 34, 34,
    34, 34, 34, 34, 34, 34, 34, 34, 34, 68, 0, 0, 0, 0, 34, 34, 34, 34, 34, 34,
    34, 34, 34, 34, 50, 50, 50, 50, 51, 68, 0, 0, 0, 0,
  ].map((n) => {
    if (n) {
      return n - 1;
    }
    return n;
  }),
  1: [
    0, 0, 0, 0, 0, 0, 1089, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113,
    1114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1121, 1122, 1123, 1124, 1055, 1056,
    1127, 1128, 1129, 1130, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1137, 1138, 1139,
    1140, 1071, 1072, 1143, 1144, 1145, 1146, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1153, 1234, 1235, 1236, 1087, 1088, 1239, 1240, 1241, 1162, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1250, 1251, 1252, 1103, 1104, 1255, 1256, 1257, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1266, 1267, 1268, 1119, 1120, 1271, 1272, 1273,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ].map((n) => {
    if (n) {
      return n - 769;
    }
    return n;
  }),
};

function Tile({
  pos = [0, 0, 0],
  mapTestValue,
  ...props
}: {
  pos: Vector3;
  mapTestValue: number;
  props?: MeshProps;
}) {
  const { texture } = useContext(textureContext);

  if (texture) {
    const copy = texture.clone();
    copy.offset.y = (15 - Math.floor(mapTestValue / 16)) / 16;

    console.log();
    copy.offset.x = (mapTestValue % 16) / 16;
    console.log(mapTestValue % 16);

    copy.needsUpdate = true;

    return (
      <sprite {...props} position={pos}>
        <spriteMaterial map={copy} color="#e0e0e0" />
      </sprite>
    );
  }
  return null;
}

export function BaseFloor({
  map,
  mapRef,
  path,
  set,
  ...props
}: {
  map: GameMap;
  mapRef: MutableRefObject<GameMap>;
  path: string;
  set: number;
  props?: MeshProps;
}) {
  const meshRef = useRef<THREE.Mesh>();

  const size = map.width;

  const grid = gridGenerator(size, map.height);
  console.log(grid);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z = mapRef.current.id === map.id ? -1 : 2;
    }
  });

  console.log(mapTest[set as 0 | 1]);

  // Must be a suspense null in a parent component before the useTexture in order to work
  return (
    <AssetsLoader texturePath={path}>
      <mesh ref={meshRef} {...props} onClick={() => console.log('click')}>
        {grid.map(([x, y], index) => {
          const mapTestValue = mapTest[set as 0 | 1][index];
          const centeredX = x - size / 2;
          const centeredY = y + 4 - size / 2;

          if (mapTestValue) {
            return (
              <Tile
                key={`${x}-${y}`}
                pos={[centeredX, centeredY, -1]}
                mapTestValue={mapTestValue}
              />
            );
          }
          return null;
        })}
      </mesh>
    </AssetsLoader>
  );
}
