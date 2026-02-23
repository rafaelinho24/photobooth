import { useCallback, useEffect, useState } from 'react';

interface LiveViewState {
  src: string;
  isConnected: boolean;
  onLoad: () => void;
  onError: () => void;
}

// WHY: fps=10 balances smoothness with server load — higher fps saturates the CCAPI endpoint
export function useLiveView(fps = 10): LiveViewState {
  const [src, setSrc] = useState('/api/liveview?t=0');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSrc(`/api/liveview?t=${Date.now()}`);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [fps]);

  const onLoad = useCallback(() => setIsConnected(true), []);
  const onError = useCallback(() => setIsConnected(false), []);

  return { src, isConnected, onLoad, onError };
}
