import { MeshProps, useFrame, Vector3 } from '@react-three/fiber';
import {
  Fragment,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import { GameMap, MapSlug } from '../../database/maps';
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
  mapData,
  ...props
}: {
  pos: Vector3;
  mapTestValue: number;
  mapData: any[];
  props?: MeshProps;
}) {
  const { texture } = useContext(textureContext);

  const sortLayerRef = mapData.tilesets.sort((a, b) => a.firstgid > b.firstgid);

  const tileSource = sortLayerRef.find((set, index, arr) => {
    if (index === arr.length - 1) return true;

    return arr[index + 1]?.firstgid > mapTestValue;
  });

  const tileTexture = texture.find((text) =>
    text.image.src.includes(tileSource.source),
  );

  if (tileTexture) {
    const copy = tileTexture.clone();
    // console.log(
    //   mapTestValue,
    //   tileTexture.image.src,
    //   mapTestValue - tileSource.firstgid,
    // );
    const gridx = Math.floor(copy.image.width / 32);
    const gridy = Math.floor(copy.image.height / 32);

    console.log(
      gridx,
      (mapTestValue - tileSource.firstgid) % gridx,
      gridy - 1 - Math.floor((mapTestValue - tileSource.firstgid) / gridy),
    );
    copy.wrapS = copy.wrapT = THREE.RepeatWrapping;
    copy.repeat.set(1 / gridx, 1 / gridy);
    copy.magFilter = THREE.NearestFilter;
    copy.offset.y =
      (gridy - 1 - Math.floor((mapTestValue - tileSource.firstgid) / gridy)) /
      gridy;
    copy.offset.x = ((mapTestValue - tileSource.firstgid) % gridx) / gridx;

    copy.needsUpdate = true;

    return (
      <sprite {...props} position={pos}>
        <spriteMaterial map={copy} color="#e0e0e0" />
      </sprite>
    );
  }
  return null;
}

export function MapComponent({
  slug,
  stateRef,
}: {
  slug: MapSlug;
  stateRef: MutableRefObject<GameMap>;
}) {
  const [mapData, setMapData] = useState<any[] | undefined>();
  const meshRef = useRef<THREE.Mesh>();
  console.log(slug);

  useEffect(() => {
    async function get() {
      const dataa = await import(`../../database/maps/${slug}`);
      setMapData(dataa.default);
    }
    get().catch(() => {});
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z =
        stateRef.current.id === mapData?.properties?.[0].value ? -1 : 2;
    }
  });

  if (!mapData) {
    return null;
  }

  const grid = gridGenerator(mapData.width, mapData.height);

  // Must be a suspense null in a parent component before the useTexture in order to work
  return (
    <AssetsLoader texturePath={mapData.tilesets.map((tile) => tile.source)}>
      <mesh ref={meshRef} onClick={() => console.log('click')}>
        {mapData.layers.map((layer, ind) => {
          return (
            <Fragment key={`fragment-${layer.name}`}>
              {grid.map(([x, y], index) => {
                const mapTestValue = layer.data[index];
                const centeredX = x - mapData.width / 2;
                const centeredY = y + 4 - mapData.width / 2;

                if (mapTestValue) {
                  return (
                    <Tile
                      key={`${x}-${y}-${layer.name}`}
                      pos={[centeredX, centeredY, -1]}
                      mapTestValue={mapTestValue}
                      mapData={mapData}
                    />
                  );
                }
                return null;
              })}
            </Fragment>
          );
        })}
      </mesh>
    </AssetsLoader>
  );
}
