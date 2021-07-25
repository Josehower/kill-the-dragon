import { useCallback, useEffect, useRef } from 'react';

export default function useAnimationFrame(event: Function) {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const secRef = useRef<number>(0);

  const animate = useCallback(
    time => {
      const deltaTime = time - previousTimeRef.current;
      event(time, deltaTime, secRef);
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [event]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]); // Make sure the effect runs only once

  return requestRef.current;
}
