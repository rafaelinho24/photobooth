import { cn } from '@utils/cn';

import type { Photo } from './types';

interface PhotoStripProps {
  photos: Photo[];
  selectedPhoto: Photo | null;
  onSelect: (photo: Photo) => void;
}

export function PhotoStrip({ photos, selectedPhoto, onSelect }: PhotoStripProps) {
  if (photos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">Aucune photo — en attente d&apos;EOS Utility…</p>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center gap-2 overflow-x-auto px-1 py-1">
      {photos.map(photo => (
        <button
          key={photo.filename}
          type="button"
          onClick={() => onSelect(photo)}
          aria-label={`Sélectionner ${photo.filename}`}
          aria-pressed={selectedPhoto?.filename === photo.filename}
          className={cn(
            'relative h-full shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none',
            // WHY: aspect-[2/3] matches portrait photo format from R6 Mark II
            'aspect-[2/3]',
            selectedPhoto?.filename === photo.filename
              ? 'border-gray-900'
              : 'border-transparent hover:border-gray-300',
          )}
        >
          <img
            src={photo.url}
            alt={photo.filename}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
}
