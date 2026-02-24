import { cn } from '@utils/cn';

import type { Photo } from './types';

interface CoverFlowProps {
  photos: Photo[];
  selectedPhoto: Photo | null;
  onSelect: (photo: Photo) => void;
}

// Number of photos visible on each side of the selected one
const VISIBLE_RANGE = 2;

// Vertical offset in px between each item
const ITEM_OFFSET = 148;

export function CoverFlow({ photos, selectedPhoto, onSelect }: CoverFlowProps) {
  const selectedIndex = selectedPhoto
    ? photos.findIndex(p => p.filename === selectedPhoto.filename)
    : 0;

  if (photos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="px-2 text-center text-xs text-neutral-500">
          Aucune photo — en attente d&apos;EOS Utility…
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      {photos.map((photo, index) => {
        const offset = index - selectedIndex;
        const absOffset = Math.abs(offset);

        if (absOffset > VISIBLE_RANGE) return null;

        const isSelected = offset === 0;
        const scale = isSelected ? 1 : 1 - absOffset * 0.2;
        const opacity = isSelected ? 1 : 1 - absOffset * 0.35;
        const translateY = offset * ITEM_OFFSET;

        return (
          <button
            key={photo.filename}
            type="button"
            onClick={() => onSelect(photo)}
            aria-label={`Sélectionner ${photo.filename}`}
            aria-pressed={isSelected}
            style={{
              position: 'absolute',
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              zIndex: VISIBLE_RANGE - absOffset,
              transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
            }}
            className={cn(
              'animate-glow-pulse aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-xl border-2 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
              isSelected ? 'border-white' : 'border-transparent',
            )}
          >
            <img
              src={photo.url}
              alt={photo.filename}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        );
      })}
    </div>
  );
}
