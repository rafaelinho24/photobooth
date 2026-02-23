import type { Gabarit } from '@features/gabarit';
import { cn } from '@utils/cn';
import { ImageIcon } from 'lucide-react';

import type { Photo } from './types';

interface ViewerPanelProps {
  photo: Photo | null;
  gabarit: Gabarit | null;
  className?: string;
}

export function ViewerPanel({ photo, gabarit, className }: ViewerPanelProps) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100',
        className,
      )}
    >
      {photo ? (
        <>
          <img
            src={photo.url}
            alt="Aperçu de la capture"
            className="h-full w-full object-contain"
          />
          {/* PNG gabarit overlay */}
          {gabarit && (
            <img
              src={gabarit.url}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <ImageIcon size={48} strokeWidth={1} className="text-gray-300" aria-hidden="true" />
          <p className="text-sm text-gray-400">Sélectionnez une photo</p>
        </div>
      )}
    </div>
  );
}
