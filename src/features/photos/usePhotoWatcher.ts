import { useCallback, useEffect, useRef, useState } from 'react';

import type { Photo } from './types';

interface PhotoWatcherState {
  photos: Photo[];
  selectedPhoto: Photo | null;
  isWatching: boolean;
  selectPhoto: (photo: Photo) => void;
}

// WHY: 2s poll interval — fast enough to feel instant after a shot, light enough on the server
export function usePhotoWatcher(pollInterval = 2000): PhotoWatcherState {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  // WHY: ref instead of state — avoids triggering re-renders on every poll tick
  const latestFilename = useRef<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch('/api/photos');
      if (!res.ok) {
        setIsWatching(false);
        return;
      }

      const data = (await res.json()) as { photos: Photo[] };
      setPhotos(data.photos);
      setIsWatching(true);

      // Auto-select newest photo only when a new one appears
      const newest = data.photos[0] ?? null;
      if (newest && newest.filename !== latestFilename.current) {
        latestFilename.current = newest.filename;
        setSelectedPhoto(newest);
      }
    } catch {
      setIsWatching(false);
    }
  }, []);

  useEffect(() => {
    // WHY: setInterval with immediate first tick — avoids calling setState synchronously in effect body
    const interval = setInterval(() => void fetchPhotos(), pollInterval);
    // Trigger first fetch after the next tick so React's render cycle is complete
    const first = setTimeout(() => void fetchPhotos(), 0);
    return () => {
      clearInterval(interval);
      clearTimeout(first);
    };
  }, [fetchPhotos, pollInterval]);

  return { photos, selectedPhoto, isWatching, selectPhoto: setSelectedPhoto };
}
