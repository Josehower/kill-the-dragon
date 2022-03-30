import * as THREE from 'three';
import { TileAnimation } from '../types/tiled';

export function tiledToR3FTextureTranspiler(
  tileValue: number,
  texture: THREE.Texture,
  tileSize: number | [number, number],
) {
  const tileSizeVector = Array.isArray(tileSize)
    ? tileSize
    : [tileSize, tileSize];

  // image width and height size (e.g 512px) / tile width and height size (e.g. 32px)
  const tilesAmountX = texture.image.width / tileSizeVector[0];
  const tilesAmountY = texture.image.height / tileSizeVector[1];

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionX = Math.floor(tileValue % tilesAmountX);

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionY =
    -1 + tilesAmountY - Math.floor(tileValue / tilesAmountX);

  return {
    repeat: { x: 1 / tilesAmountX, y: 1 / tilesAmountY },
    offset: {
      x: texturePositionX / tilesAmountX,
      y: texturePositionY / tilesAmountY,
    },
  };
}

export function createTileTextureAnimator(
  texture: THREE.Texture,
  tileSize: number | [number, number],
  startValue: number = 0,
) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const tileSizeVector = Array.isArray(tileSize)
    ? tileSize
    : [tileSize, tileSize];

  // image width and height size (e.g 512px) / tile width and height size (e.g. 32px)
  const tilesAmountX = texture.image.width / tileSizeVector[0];
  const tilesAmountY = texture.image.height / tileSizeVector[1];

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionX = Math.floor(startValue % tilesAmountX);

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionY =
    -1 + tilesAmountY - Math.floor(startValue / tilesAmountX);

  texture.repeat.set(1 / tilesAmountX, 1 / tilesAmountY);

  texture.offset.x = texturePositionX / tilesAmountX;
  texture.offset.y = texturePositionY / tilesAmountY;

  return (value: number) => {
    const { offset } = tiledToR3FTextureTranspiler(value, texture, tileSize);

    texture.offset.x = offset.x;
    texture.offset.y = offset.y;
  };
}

function createFrameRegulator(
  func: (activator: number, reset?: () => void, prop?: number | string) => any,
  ms: number,
  ini: boolean = true,
) {
  let deltaAccumulator = ini ? ms : 0;
  let activator = 0;

  function reset() {
    deltaAccumulator = ini ? ms : 0;
    activator = 0;
  }

  return function (frameDelta: number, prop?: number | string) {
    deltaAccumulator += frameDelta * 1000;

    if (deltaAccumulator >= ms) {
      func(activator, reset, prop);
      deltaAccumulator = 0;
      activator += 1;
    }

    return reset;
  };
}

// createAnimation(texture, animation, {
//   tileSize: 32,
//   loop: true,
//   speed: 100
//   control: undefined,
//   dependencies: [],
//   fastStart: true,

// });

export function createLoopAnimation(
  sprite: THREE.Sprite,
  animation: TileAnimation | number[],
  options?: {
    tileSize?: number | [number, number];
    speed?: number;
    moveX?: number;
    moveY?: number;
  },
) {
  const tileSizeDefault = 32;
  const speedDefault = 100;
  const moveXDefault = 0;
  const moveYDefault = 0;

  if (!sprite.material.map) {
    throw new Error('Sprite must contain a texture to animate');
  }

  const animator = createTileTextureAnimator(
    sprite.material.map,
    (options && options.tileSize) || tileSizeDefault,
  );

  const animationCallback = (activator: number) => {
    const tileidArr = animation.map((step) =>
      typeof step === 'number' ? step : step.tileid,
    );
    animator(tileidArr[activator % tileidArr.length]);
  };

  const regulator = createFrameRegulator(
    animationCallback,
    typeof animation[0] === 'number'
      ? (options && options.speed) || speedDefault
      : animation[0].duration,
  );

  return (delta: number, control: boolean = true, prop?: number | string) => {
    if (control) {
      sprite.position.x += (options && options.moveX) || moveXDefault;
      sprite.position.y += (options && options.moveY) || moveYDefault;

      regulator(delta, prop);
    }
  };
}

export function createScriptAnimation(
  sprite: THREE.Sprite,
  animation: TileAnimation | number[],
  options?: {
    tileSize?: number | [number, number];
    speed?: number;
    moveX?: number;
    moveY?: number;
  },
) {
  const tileSizeDefault = 32;
  const speedDefault = 100;

  if (!sprite.material.map) {
    throw new Error('Sprite must contain a texture to animate');
  }

  const animator = createTileTextureAnimator(
    sprite.material.map,
    (options && options.tileSize) || tileSizeDefault,
  );

  const animationCallback = (activator: number) => {
    const tileidArr = animation.map((step) =>
      typeof step === 'number' ? step : step.tileid,
    );
    sprite.position.x += animation[activator % tileidArr.length].portX || 0;
    animator(tileidArr[activator % tileidArr.length]);
  };

  let singleIterationControl = true;

  const regulator = createFlexFrameRegulator(
    animationCallback,
    typeof animation[0] === 'number'
      ? (options && [options.speed]) || [speedDefault]
      : animation.map((frame) => frame.duration),
    (index) => {
      sprite.position.x += animation[index].moveX || 0;
    },
    () => {
      singleIterationControl = false;
    },
    false,
  );
  const reset = regulator(0);
  return (delta: number, control: boolean = true, prop?: number | string) => {
    if (control && singleIterationControl) {
      // sprite.position.x += (options && options.moveX) || moveXDefault;
      // sprite.position.y += (options && options.moveY) || moveYDefault;

      regulator(delta, prop);
    } else if (!control) {
      singleIterationControl = true;
      reset();
    }

    return reset;
  };
}

function createFlexFrameRegulator(
  func: (activator: number, reset?: () => void, prop?: number | string) => any,
  ms: number[],
  always: (n: number) => void,
  afterRound?: () => void,
  ini: boolean = true,
) {
  let msIndex = 0;
  let deltaAccumulator = ini ? ms[msIndex] : 0;
  let activator = 0;

  function reset() {
    msIndex = 0;
    deltaAccumulator = ini ? ms[0] : 0;
    activator = 0;
  }

  return function (frameDelta: number, prop?: number | string): () => void {
    deltaAccumulator += frameDelta * 1000;

    always(msIndex);

    if (deltaAccumulator >= ms[msIndex]) {
      func(activator, reset, prop);
      deltaAccumulator = 0;
      activator += 1;
      if (ms[msIndex + 1]) {
        msIndex += 1;
      } else {
        msIndex = 0;
        afterRound && afterRound();
      }
    }

    return reset;
  };
}
