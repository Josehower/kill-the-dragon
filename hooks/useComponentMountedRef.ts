import { useEffect, useRef } from 'react';

export default function useComponentMountedRef() {
  const mountRef = useRef(false);

  useEffect(() => {
    mountRef.current = true;
    return () => {
      mountRef.current = false;
    };
  }, []);

  return mountRef;
}
