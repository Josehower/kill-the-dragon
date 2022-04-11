import { MeshProps, useFrame, Vector3 } from '@react-three/fiber';
import { diffProps } from '@react-three/fiber/dist/declarations/src/core/utils';
import {
  Fragment,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import { Encounter } from '../../database/encounters';
import { MapSlug } from '../../database/maps/mapList';
import { JsonMap, JsonTileset } from '../../types/tiled';
import { isInsidePortal } from '../../utils/colliders';
import { gridGenerator } from '../../utils/map';
import { tiledToR3FTextureTranspiler } from '../../utils/tiles';
import AssetsLoader, { textureContext } from '../AssetsLoader';

type TilesetsData = { module: JsonTileset; firstgid: number }[];

export function MapComponent({
  slug,
  currentMapRef,
  characterRef,
  encounterRef,
  eventIdQueueRef,
  children,
}: {
  slug: MapSlug;
  currentMapRef: MutableRefObject<MapSlug>;
  characterRef: MutableRefObject<THREE.Sprite | undefined>;
  encounterRef: MutableRefObject<Encounter | null>;
  eventIdQueueRef: MutableRefObject<number[]>;
  children?: JSX.Element;
}) {
  const [mapData, setMapData] = useState<JsonMap | undefined>();
  const tilesetsData = useRef<TilesetsData>([]);
  const meshRef = useRef<THREE.Mesh>();

  const portals =
    mapData && mapData.layers.find((layer) => layer.name === 'portals');

  useEffect(() => {
    async function get() {
      const { default: file }: { default: JsonMap } = await import(
        `../../database/maps/${slug}`
      );

      const texturesSourcePaths = await Promise.all(
        file.tilesets.map((tileSet) =>
          import(
            `../../database/tilesets/${tileSet.source.replace(
              '../tilesets/',
              '',
            )}`
          ).then((json: { default: JsonTileset }) => {
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

      tilesetsData.current = texturesSourcePaths;
      setMapData(file);
    }

    get().catch(() => {});
  }, [slug]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z =
        slug !== currentMapRef.current ? 2 : encounterRef.current ? 2 : -1;
    }

    if (
      !characterRef.current ||
      !meshRef.current ||
      meshRef.current.position.z === 2
    ) {
      return;
    }

    const topLeft = [
      characterRef.current.position.x - 0.3,
      characterRef.current.position.y - 0.2,
    ];

    const topRight = [
      characterRef.current.position.x + 0.3,
      characterRef.current.position.y - 0.2,
    ];
    const bottomLeft = [
      characterRef.current.position.x - 0.3,
      characterRef.current.position.y - 0.8,
    ];
    const bottomRight = [
      characterRef.current.position.x + 0.3,
      characterRef.current.position.y - 0.8,
    ];

    if (
      !mapData ||
      !mapData.tilewidth ||
      !portals ||
      !mapData.tileheight ||
      !portals.objects
    ) {
      return;
    }

    const test = portals.objects.find((portal) =>
      [topLeft, topRight, bottomLeft, bottomRight].some((edge) =>
        isInsidePortal({
          portal: {
            position: {
              x: portal.x,
              y: portal.y,
            },
            size: {
              pixelsWidth: portal.width,
              pixelsHeight: portal.height,
            },
          },
          tileMap: {
            mapSize: {
              tilesWidth: mapData.width,
              tilesHeight: mapData.height,
            },
            tileSize: {
              pixelsWidth: mapData.tilewidth,
              pixelsHeight: mapData.tileheight,
            },
            offset: {
              x:
                ((mapData.properties &&
                  mapData.properties.find((prop) => prop.name === 'offsetX')
                    ?.value) as number) || 0,
              y:
                ((mapData.properties &&
                  mapData.properties.find((prop) => prop.name === 'offsetY')
                    ?.value) as number) || 0,
            },
          },
          XYPositionToCheck: { x: edge[0], y: edge[1] },
        }),
      ),
    );

    const eventId: number | undefined = test?.properties.find(
      (prop) => prop.name === 'eventId',
    )?.value;

    if (eventId !== undefined) {
      eventIdQueueRef.current.push(eventId);
    }
  });

  if (!mapData) {
    return null;
  }

  const offsetX =
    mapData.properties &&
    (mapData.properties.find((prop) => prop.name === 'offsetX') as
      | {
          name: 'offsetX';
          type: 'int';
          value: number;
        }
      | undefined);

  const offsetY =
    mapData.properties &&
    (mapData.properties.find((prop) => prop.name === 'offsetY') as
      | {
          name: 'offsetY';
          type: 'int';
          value: number;
        }
      | undefined);

  const layerGrid = gridGenerator(
    mapData.width,
    mapData.height,
    // if one offset is undefined it pass 0 as value
    offsetX || offsetY ? [offsetX?.value ?? 0, offsetY?.value ?? 0] : undefined,
  );

  return (
    <AssetsLoader
      texturePath={tilesetsData.current.map((tileset) => tileset.module.image)}
    >
      <mesh ref={meshRef}>
        {children}
        {mapData.layers.map((layer) => {
          if (
            (layer.properties &&
              layer.properties.some((prop) => prop.name === 'collider')) ||
            layer.name === 'portals'
          ) {
            return null;
          }
          return (
            <Fragment key={`fragment-${layer.name}`}>
              {layerGrid.map(([x, y], index) => {
                const mapTileValue = layer.data[index];

                if (mapTileValue > 0) {
                  return (
                    <Tile
                      key={`tile-x:${x}-y:${y}-${layer.name}`}
                      pos={[x - mapData.width / 2, y - mapData.height / 2, -1]}
                      mapTileValue={mapTileValue}
                      tilesetsData={tilesetsData.current}
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

function Tile({
  pos,
  mapTileValue,
  tilesetsData,
  ...props
}: {
  pos: Vector3;
  mapTileValue: number;
  tilesetsData: TilesetsData;
  props?: MeshProps;
}) {
  const { assets: textures } = useContext(textureContext);

  const tileTilesetSource = tilesetsData
    .sort((a, b) => a.firstgid - b.firstgid)
    .find((a_a, index, arr) => {
      if (index !== arr.length - 1) {
        // if is not the last tilesetSource in the array compare against the next source
        return arr[index + 1].firstgid > mapTileValue;
      } else {
        return true;
      }
    });

  const tileTexture =
    textures && Array.isArray(textures)
      ? textures.find((text) => {
          if (tileTilesetSource) {
            return text.image.src.includes(tileTilesetSource.module.image);
          }
          return false;
        })
      : textures;

  if (tileTexture && tileTilesetSource) {
    const textureClone = tileTexture.clone();
    // value of the tile in relation to the tilesetSource
    const tileValueOnTileset = mapTileValue - tileTilesetSource.firstgid;

    const { offset, repeat } = tiledToR3FTextureTranspiler(
      tileValueOnTileset,
      textureClone.image.width,
      textureClone.image.height,
      [tileTilesetSource.module.tilewidth, tileTilesetSource.module.tileheight],
    );

    textureClone.repeat.set(repeat.x, repeat.y);
    textureClone.offset.x = offset.x;
    textureClone.offset.y = offset.y;

    textureClone.wrapS = textureClone.wrapT = THREE.RepeatWrapping;
    textureClone.magFilter = THREE.NearestFilter;
    textureClone.needsUpdate = true;

    return (
      <sprite {...props} position={pos}>
        <planeGeometry />
        <spriteMaterial map={textureClone} color="#e0e0e0" />
      </sprite>
    );
  }
  return null;
}
