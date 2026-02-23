import { useMemo, useState } from 'react';

import type { Gabarit } from './types';

// WHY: import.meta.glob is a Vite build-time macro — must be a static literal pattern,
// cannot be constructed dynamically. Placing it at module level makes the pattern obvious.
const GABARIT_MODULES = import.meta.glob<string>('/src/assets/gabarits/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function useGabarit() {
  const [selected, setSelected] = useState<Gabarit | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const gabarits: Gabarit[] = useMemo(
    () =>
      Object.entries(GABARIT_MODULES).map(([path, url]) => ({
        id: path,
        // WHY: strip path prefix and extension to get a human-readable display name
        name:
          path
            .split('/')
            .pop()
            ?.replace(/\.png$/i, '') ?? path,
        url,
      })),
    [],
  );

  function openPicker() {
    setIsPickerOpen(true);
  }

  function closePicker() {
    setIsPickerOpen(false);
  }

  function selectGabarit(gabarit: Gabarit | null) {
    setSelected(gabarit);
    setIsPickerOpen(false);
  }

  return {
    selected,
    gabarits,
    isPickerOpen,
    openPicker,
    closePicker,
    selectGabarit,
  };
}
