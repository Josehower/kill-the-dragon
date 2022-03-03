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

function Tile({
  pos = [0, 0, 0],
  mapTestValue,
  tilesetsData,
  ...props
}: {
  pos: Vector3;
  mapTestValue: number;
  tilesetsData: any[];
  props?: MeshProps;
}) {
  const { texture } = useContext(textureContext);

  const sortLayerRef = tilesetsData.sort((a, b) => a.firstgid > b.firstgid);

  const tileSource = sortLayerRef.find((set, index, arr) => {
    if (index === arr.length - 1) return true;

    return arr[index + 1]?.firstgid > mapTestValue;
  });

  const tileTexture = texture.find((text) =>
    text.image.src.includes(tileSource.module.image),
  );

  if (tileTexture) {
    const copy = tileTexture.clone();

    const gridx = copy.image.width / tileSource.module.tilewidth;
    const gridy = copy.image.height / tileSource.module.tileheight;

    copy.wrapS = copy.wrapT = THREE.RepeatWrapping;

    copy.repeat.set(1 / gridx, 1 / gridy);
    copy.magFilter = THREE.NearestFilter;

    // transform a tiled number into a Y coordinate of three.js => gridHeight -1 (to start from 0) - (tiled number / gridWidth) rounded down
    const offy =
      gridy - 1 - Math.floor((mapTestValue - tileSource.firstgid) / gridx);
    // transform a tiled number into a X coordinate of three.js => tiled number MOD gridWidth
    const offx = (mapTestValue - tileSource.firstgid) % gridx;

    copy.offset.y = offy / gridy;
    copy.offset.x = offx / gridx;

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
  const [tilesetsData, setTilesetData] = useState<any[] | undefined>();
  const meshRef = useRef<THREE.Mesh>();

  useEffect(() => {
    async function get() {
      const { default: file } = await import(`../../database/maps/${slug}`);

      const texturesSourcePaths = await Promise.all(
        file.tilesets.map((tileSet) =>
          import(
            `../../database/tilesets/${tileSet.source.replace(
              '../tilesets/',
              '',
            )}`
          ).then((json) => {
            return {
              module: {
                ...json.default,
                image: json.default.image.replace('../../public', ''),
              },
              firstgid: tileSet.firstgid,
            };
          }),
        ),
      );

      setTilesetData(texturesSourcePaths);
      setMapData(file);
    }
    get().catch(() => {});
  }, [slug]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z =
        stateRef.current.id === mapData?.properties?.[0].value ? -1 : 2;
    }
  });

  if (!tilesetsData || !mapData) {
    return null;
  }

  const offsetX = mapData.properties.find((prop) => prop.name === 'offsetX');
  const offsetY = mapData.properties.find((prop) => prop.name === 'offsetY');

  const offset =
    offsetX || offsetY ? [offsetX?.value ?? 0, offsetY?.value ?? 0] : undefined;

  const grid = gridGenerator(mapData.width, mapData.height, offset);

  // Must be a suspense null in a parent component before the useTexture in order to work
  return (
    <AssetsLoader
      texturePath={tilesetsData.map((tileset) => tileset.module.image)}
    >
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
                      tilesetsData={tilesetsData}
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
