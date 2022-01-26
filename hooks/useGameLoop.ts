import { addEffect } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import useComponentMountedRef from './useComponentMountedRef';

type EventLoop<T> = (
  time: number,
  deltaTime: number,
  secRef: MutableRefObject<T | undefined>,
) => void;

export default function useGameLoop<T>(event: EventLoop<T>) {
  const isMounted = useComponentMountedRef();
  const previousTimeRef = useRef<number>(+Date.now());
  const secRef = useRef<T>();
  const isGamePaused = false;
  if (!isGamePaused) {
    addEffect((time) => {
      if (!isMounted.current) return;
      const prevRef = previousTimeRef;
      const now = +Date.now();
      const deltaTime = now - prevRef.current;
      event(time, deltaTime, secRef);
      previousTimeRef.current = now;
    });
  }
}
