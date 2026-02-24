import { cn } from '@utils/cn';
import { useState } from 'react';

import type { Gabarit } from './types';

interface GabaritPanelProps {
  gabarits: Gabarit[];
  selected: Gabarit | null;
  onSelect: (gabarit: Gabarit | null) => void;
}

const PLACEHOLDER_COLORS = [
  { id: 'placeholder-rose', name: 'Rose', color: '#f43f5e' },
  { id: 'placeholder-bleu', name: 'Bleu', color: '#3b82f6' },
  { id: 'placeholder-vert', name: 'Vert', color: '#22c55e' },
  { id: 'placeholder-noir', name: 'Noir', color: '#171717' },
];

const VISIBLE_RANGE = 2;
const ITEM_OFFSET = 148;

export function GabaritPanel({ gabarits, selected, onSelect }: GabaritPanelProps) {
  const [placeholderSelected, setPlaceholderSelected] = useState<string | null>(null);

  const hasGabarits = gabarits.length > 0;

  // Unified item list and selected index for Cover Flow logic
  const items = hasGabarits
    ? gabarits.map(g => ({ id: g.id, label: g.name, url: g.url, color: undefined }))
    : PLACEHOLDER_COLORS.map(c => ({ id: c.id, label: c.name, url: undefined, color: c.color }));

  const selectedId = hasGabarits ? (selected?.id ?? null) : placeholderSelected;
  const selectedIndex = selectedId ? items.findIndex(item => item.id === selectedId) : 0;

  function handleSelect(id: string) {
    if (hasGabarits) {
      const g = gabarits.find(g => g.id === id) ?? null;
      onSelect(selected?.id === id ? null : g);
    } else {
      setPlaceholderSelected(prev => (prev === id ? null : id));
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <h2 className="shrink-0 text-center text-xs font-semibold tracking-widest text-neutral-500 uppercase">
        Filtres
      </h2>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        {items.map((item, index) => {
          const offset = index - selectedIndex;
          const absOffset = Math.abs(offset);

          if (absOffset > VISIBLE_RANGE) return null;

          const isSelected = offset === 0;
          const scale = isSelected ? 1 : 1 - absOffset * 0.2;
          const opacity = isSelected ? 1 : 1 - absOffset * 0.35;
          const translateY = offset * ITEM_OFFSET;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-label={item.label}
              aria-pressed={isSelected && selectedId !== null}
              style={{
                position: 'absolute',
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                zIndex: VISIBLE_RANGE - absOffset,
                transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
                backgroundColor: item.color,
              }}
              className={cn(
                'animate-glow-pulse aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-xl border-2 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
                isSelected && selectedId !== null ? 'border-white' : 'border-transparent',
              )}
            >
              {item.url ? (
                <img src={item.url} alt={item.label} className="h-full w-full object-contain" />
              ) : (
                <span className="flex h-full items-end justify-center pb-2">
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    {item.label}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
