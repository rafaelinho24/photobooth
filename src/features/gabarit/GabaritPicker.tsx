import { Modal } from '@components/ui/Modal';
import { cn } from '@utils/cn';
import { ImageOff } from 'lucide-react';

import type { Gabarit } from './types';

interface GabaritPickerProps {
  isOpen: boolean;
  onClose: () => void;
  gabarits: Gabarit[];
  selected: Gabarit | null;
  onSelect: (gabarit: Gabarit | null) => void;
}

export function GabaritPicker({
  isOpen,
  onClose,
  gabarits,
  selected,
  onSelect,
}: GabaritPickerProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choisir un gabarit" className="max-w-2xl">
      {gabarits.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <ImageOff size={40} strokeWidth={1} className="text-gray-300" aria-hidden="true" />
          <p className="text-sm text-gray-500">Aucun gabarit disponible.</p>
          <p className="text-xs text-gray-400">
            Ajoutez des fichiers PNG dans{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-gray-600">
              src/assets/gabarits/
            </code>
          </p>
        </div>
      ) : (
        <>
          {/* Thumbnail grid */}
          <div className="grid grid-cols-3 gap-3" role="listbox" aria-label="Gabarits disponibles">
            {gabarits.map(gabarit => (
              <button
                key={gabarit.id}
                type="button"
                role="option"
                aria-selected={selected?.id === gabarit.id}
                onClick={() => onSelect(gabarit)}
                className={cn(
                  'group overflow-hidden rounded-xl border-2 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none',
                  selected?.id === gabarit.id
                    ? 'border-gray-900'
                    : 'border-transparent hover:border-gray-300',
                )}
              >
                <div className="aspect-[3/2] w-full bg-gray-100">
                  <img
                    src={gabarit.url}
                    alt={gabarit.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p
                  className={cn(
                    'truncate px-2 py-1.5 text-center text-xs',
                    selected?.id === gabarit.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600',
                  )}
                >
                  {gabarit.name}
                </p>
              </button>
            ))}
          </div>

          {/* Remove gabarit option */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => onSelect(null)}
              className={cn(
                'w-full rounded-lg px-4 py-2 text-sm transition-colors duration-150',
                selected === null
                  ? 'bg-gray-100 font-medium text-gray-700'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600',
              )}
            >
              Sans gabarit
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
