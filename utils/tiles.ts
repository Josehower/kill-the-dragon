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
    frameDuration?: number;
    constantMove?: { x?: number; y?: number };
  },
) {
  const tileSizeDefault = 32;
  const frameDurationDefault = 100;
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

  const regulator = createAnimationFrameRegulator(
    animationCallback,
    typeof animation[0] === 'number'
      ? (options && options.frameDuration) || frameDurationDefault
      : // Array of durations
        (animation as TileAnimation).map((frame) => frame.duration),
    {
      onEveryCall: () => {
        sprite.position.x +=
          (options && options.constantMove?.x) || moveXDefault;
        sprite.position.y +=
          (options && options.constantMove?.y) || moveYDefault;
      },
    },
  );

  return (delta: number, control: boolean = true) => {
    if (control) {
      regulator(delta);
    }
  };
}

export function createScriptAnimation(
  sprite: THREE.Sprite,
  animation: TileAnimation | number[],
  options?: {
    tileSize?: number | [number, number];
    frameDuration?: number;
    constantMove?: { x?: number; y?: number };
  },
) {
  const tileSizeDefault = 32;
  const frameDurationDefault = 100;
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
    sprite.position.x += animation[activator % tileidArr.length].portX || 0;

    if (typeof tileidArr[activator % tileidArr.length] === 'undefined') return;

    animator(tileidArr[activator % tileidArr.length]);
  };

  // is true on onpress animation
  // let singleIterationControl = true;
  let singleIterationControl = false;
  let on = false;
  const regulator = createAnimationFrameRegulator(
    animationCallback,
    typeof animation[0] === 'number'
      ? options && options.frameDuration
        ? [options.frameDuration]
        : [frameDurationDefault]
      : (animation as TileAnimation).map((frame) => frame.duration),
    {
      onEveryCall: (index) => {
        sprite.position.x += animation[index].moveX || 0;

        sprite.position.x +=
          (options && options.constantMove?.x) || moveXDefault;
        sprite.position.y +=
          (options && options.constantMove?.y) || moveYDefault;
      },
      onRoundEnd: () => {
        singleIterationControl = false;
        on = false;
      },
      quickStart: false,
    },
  );
  const reset = regulator(0);
  return (delta: number, control: boolean = true) => {
    // option when we want on press animation
    // if (constrol && singleIterationControl) {
    //   // sprite.position.x += (options && options.moveX) || moveXDefault;
    //   // sprite.position.y += (options && options.moveY) || moveYDefault;

    //   regulator(delta, prop);
    // } else if (!control) {
    //   singleIterationControl = true;
    //   reset();
    // }

    if (singleIterationControl) {
      regulator(delta);
    } else if (control) {
      singleIterationControl = true;
      on = true;
      reset();
    }

    // return reset;
    return on;
  };
}

/**
 Create a function that wait x ms before trigger the callback.

 The Function must be called inside of `useFrame` or `raf` since depends of a delta value to count.

 Use This to wrap functions that need to be called multiple times on the `useFrame` hook but shouldn't be called on every frame.

 The function allow the option of variable waiting times when receive an array of numbers, the index of the current number in the array is being past to the function onEveryCall. If the ms value is a number index is always 0.

 >Use this index to do something on every call based on the time you are awaiting. If the ms value is a number index is always 0

 >i.e. on animations that require movement on every frame.

 */
function createAnimationFrameRegulator(
  callBackFunc: (activator: number, reset?: () => void) => any,
  ms: number[] | number,
  options?: {
    onEveryCall?: (currentIndex: number) => void;
    onRoundEnd?: () => void;
    quickStart?: boolean;
  },
) {
  const isMsArray = Array.isArray(ms);
  const { onRoundEnd, onEveryCall, quickStart } = options || {};

  if (!isMsArray && onRoundEnd) {
    throw new Error('ms must be an array to use option afterRound');
  }

  const ini = typeof quickStart === 'undefined' ? true : quickStart;

  const initialAccumulator = ini ? (isMsArray ? ms[0] : ms) : 0;

  let msIndex = 0;
  let deltaAccumulator = initialAccumulator;
  let activator = 0;

  function reset() {
    msIndex = 0;
    deltaAccumulator = initialAccumulator;
    activator = 0;
  }

  return function (frameDelta: number): () => void {
    deltaAccumulator += frameDelta * 1000;

    onEveryCall && onEveryCall(msIndex);

    if (deltaAccumulator >= (isMsArray ? ms[msIndex] : ms)) {
      callBackFunc(activator, reset);
      deltaAccumulator = 0;
      activator += 1;
      if (isMsArray && ms[msIndex + 1]) {
        msIndex += 1;
      } else if (isMsArray) {
        msIndex = 0;
        onRoundEnd && onRoundEnd();
      }
    }

    return reset;
  };
}
