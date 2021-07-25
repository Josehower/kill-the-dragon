import { addEffect } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';

export default function useAnimationFrame(event: Function) {
  const previousTimeRef = useRef<number>(+Date.now());
  const secRef = useRef<any>(0);

  addEffect(time => {
    const prevRef = previousTimeRef;
    const now = +Date.now();
    const deltaTime = now - prevRef.current;
    event(time, deltaTime, secRef);
    previousTimeRef.current = now;
  });

  // useEffect(() => {
  //   requestRef.current = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(requestRef.current);
  // }, [animate]); // Make sure the effect runs only once

  return;
}
