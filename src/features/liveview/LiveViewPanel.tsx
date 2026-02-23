import { cn } from '@utils/cn';
import { VideoOff } from 'lucide-react';

import { useLiveView } from './useLiveView';

interface LiveViewPanelProps {
  className?: string;
}

export function LiveViewPanel({ className }: LiveViewPanelProps) {
  const { src, isConnected, onLoad, onError } = useLiveView(10);

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100',
        className,
      )}
    >
      {/* Live view image — always in DOM so polling continues; hidden on error */}
      <img
        src={src}
        alt="Live view caméra"
        onLoad={onLoad}
        onError={onError}
        className={cn(
          'h-full w-full object-contain transition-opacity duration-300',
          isConnected ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Offline placeholder */}
      {!isConnected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <VideoOff size={48} strokeWidth={1} className="text-gray-300" aria-hidden="true" />
          <p className="text-sm text-gray-400">Caméra non connectée</p>
          <p className="font-mono text-xs text-gray-300">CCAPI · 192.168.1.3</p>
        </div>
      )}

      {/* Live indicator badge */}
      {isConnected && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" aria-hidden="true" />
          <span className="font-mono text-xs text-white">LIVE</span>
        </div>
      )}
    </div>
  );
}
