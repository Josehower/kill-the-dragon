import { addEffect } from '@react-three/fiber';
import { useRef } from 'react';

export default function gameLoop(event: Function) {
  const previousTimeRef = useRef<number>(+Date.now());
  const secRef = useRef<any>(0);
  const isGamePaused = false;
  if (!isGamePaused) {
    addEffect(time => {
      const prevRef = previousTimeRef;
      const now = +Date.now();
      const deltaTime = now - prevRef.current;
      event(time, deltaTime, secRef);
      previousTimeRef.current = now;
    });
  }
}
