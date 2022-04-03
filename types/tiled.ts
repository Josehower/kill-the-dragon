export type JsonTileset = {
  columns: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tiledversion: string;
  tileheight: number;
  tilewidth: number;
  type: string;
  version: string;
};

export type JsonMap = {
  compressionlevel: number;
  editorsettings: {
    export: {
      format: string;
      target?: string;
    };
  };
  height: number;
  infinite: boolean;
  layers: {
    data: number[];
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
  }[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  properties:
    | [
        {
          name: 'id';
          type: 'int';
          value: number;
        },
        {
          name: 'offsetX';
          type: 'int';
          value: number;
        },
        {
          name: 'offsetY';
          type: 'int';
          value: number;
        },
        {
          name: 'slug';
          type: 'string';
          value: string;
        },
      ]
    | [
        {
          name: 'id';
          type: 'int';
          value: number;
        },
        {
          name: 'slug';
          type: 'string';
          value: string;
        },
      ];
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: {
    firstgid: number;
    source: string;
  }[];
  tilewidth: number;
  type: string;
  version: string;
  width: number;
};

type TiledAnimationStep = {
  duration: number;
  tileid: number;
};

type GameAnimationStep = Omit<TiledAnimationStep, 'tileid'> & {
  port?: {
    x?: number;
    y?: number;
  };
  move?: {
    x?: number;
    y?: number;
  };
  tileid?: number;
};

export type GameSpriteAnimation = GameAnimationStep[];

export type SpriteAnimationHandler = (
  delta: number,
  control?: boolean,
) => boolean;
