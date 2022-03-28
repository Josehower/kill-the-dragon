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
import { JsonMap, JsonTileset } from '../../types/tiled';
import { gridGenerator } from '../../utils/map';
import { tiledToR3FTextureTranspiler } from '../../utils/tiles';
import AssetsLoader, { textureContext } from '../AssetsLoader';

type TilesetsData = { module: JsonTileset; firstgid: number }[];

export function MapComponent({
  slug,
  stateRef,
}: {
  slug: MapSlug;
  stateRef: MutableRefObject<GameMap>;
}) {
  const [mapData, setMapData] = useState<JsonMap | undefined>();
  const [tilesetsData, setTilesetData] = useState<TilesetsData | undefined>();
  const meshRef = useRef<THREE.Mesh>();

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

      setTilesetData(texturesSourcePaths);
      setMapData(file);
    }
    get().catch(() => {});
  }, [slug]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z =
        stateRef.current.id === mapData?.properties[0].value ? -1 : 2;
    }
  });

  if (!tilesetsData || !mapData) {
    return null;
  }

  const offsetX = mapData.properties.find((prop) => prop.name === 'offsetX') as
    | {
        name: 'offsetX';
        type: 'int';
        value: number;
      }
    | undefined;

  const offsetY = mapData.properties.find((prop) => prop.name === 'offsetY') as
    | {
        name: 'offsetY';
        type: 'int';
        value: number;
      }
    | undefined;

  const layerGrid = gridGenerator(
    mapData.width,
    mapData.height,
    // if one offset is undefined it pass 0 as value
    offsetX || offsetY ? [offsetX?.value ?? 0, offsetY?.value ?? 0] : undefined,
  );

  return (
    <AssetsLoader
      texturePath={tilesetsData.map((tileset) => tileset.module.image)}
    >
      <mesh ref={meshRef}>
        {mapData.layers.map((layer) => {
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
      textureClone,
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
        <spriteMaterial map={textureClone} color="#e0e0e0" />
      </sprite>
    );
  }
  return null;
}
