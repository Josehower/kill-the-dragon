import { useCallback, useEffect, useMemo, useRef } from 'react';

export default function useControls() {
  const keys = useMemo(() => {
    return {
      KeyW: 'forward' as const,
      KeyS: 'backward' as const,
      KeyA: 'left' as const,
      KeyD: 'right' as const,
      KeyP: 'p_letter' as const,
      KeyL: 'l_letter' as const,
      Space: 'jump' as const,
    };
  }, []);

  const moveFieldByKey = useCallback(
    (key: keyof typeof keys) => keys[key],
    [keys],
  );

  const movement = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    p_letter: false,
    l_letter: false,
  });

  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.code in keys) {
        movement.current = {
          ...movement.current,
          [moveFieldByKey(e.code as keyof typeof keys)]: true,
        };
      }
    },
    [keys, moveFieldByKey],
  );

  const handleKeyUp = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.code in keys) {
        movement.current = {
          ...movement.current,
          [moveFieldByKey(e.code as keyof typeof keys)]: false,
        };
      }
    },
    [keys, moveFieldByKey],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return movement;
}
