import { useEffect, useState } from 'react';

export default function useControls() {
  const keys = {
    KeyW: 'forward' as const,
    KeyS: 'backward' as const,
    KeyA: 'left' as const,
    KeyD: 'right' as const,
    Space: 'jump' as const,
  };

  const moveFieldByKey = (key: keyof typeof keys) => keys[key];

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    if (e.code in keys) {
      setMovement(m => ({
        ...m,
        [moveFieldByKey(e.code as keyof typeof keys)]: true,
      }));
    }
  };
  const handleKeyUp = (e: globalThis.KeyboardEvent) => {
    if (e.code in keys) {
      setMovement(m => ({
        ...m,
        [moveFieldByKey(e.code as keyof typeof keys)]: false,
      }));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return movement;
}
