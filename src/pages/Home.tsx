import { SeoHead } from '@components/features/SeoHead';
import { GabaritPicker, useGabarit } from '@features/gabarit';
import { cn } from '@utils/cn';
import { Camera, ImagePlus, Printer } from 'lucide-react';

// WHY: Placeholder state — will be replaced by usePhotoWatcher hook once backend is wired
const MOCK_STATE = {
  hasPhoto: false,
  isWatching: true,
  lastPhotoTime: null as string | null,
  photoUrl: null as string | null,
};

export default function Home() {
  const { hasPhoto, isWatching, lastPhotoTime, photoUrl } = MOCK_STATE;
  const {
    selected: gabarit,
    gabarits,
    isPickerOpen,
    openPicker,
    closePicker,
    selectGabarit,
  } = useGabarit();

  function handlePrint() {
    // WHY: window.print() triggers browser print dialog — will be replaced by backend print API
    window.print();
  }

  return (
    <>
      <SeoHead title="Photobooth" description="Application photobooth Canon Selphy" />

      <div className="flex h-screen w-screen flex-col bg-white">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="flex shrink-0 items-center justify-between px-8 py-5">
          <h1 className="text-lg font-medium tracking-tight text-gray-900">Photobooth</h1>

          {/* Gabarit selector button */}
          <button
            type="button"
            onClick={openPicker}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-all duration-150 hover:border-gray-400 hover:text-gray-900 active:scale-[0.98]"
            aria-label="Changer le gabarit"
          >
            <ImagePlus size={15} aria-hidden="true" />
            {gabarit ? gabarit.name : 'Gabarit'}
          </button>
        </header>

        {/* ── Photo display ──────────────────────────────────── */}
        <main className="flex flex-1 items-center justify-center px-8 pb-4">
          <div className="relative aspect-[3/2] w-full max-w-4xl overflow-hidden rounded-2xl bg-gray-100">
            {hasPhoto && photoUrl ? (
              <img src={photoUrl} alt="Dernière capture" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <Camera size={64} strokeWidth={1} className="text-gray-300" aria-hidden="true" />
                <p className="text-sm text-gray-400">En attente d&apos;une photo…</p>
              </div>
            )}

            {/* PNG gabarit overlay — renders on top of the photo when a gabarit is selected */}
            {gabarit && (
              <img
                src={gabarit.url}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-contain"
              />
            )}
          </div>
        </main>

        {/* ── Footer bar ─────────────────────────────────────── */}
        <footer className="flex shrink-0 items-center justify-between px-8 py-5">
          {/* Status indicator */}
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                // WHY: animated pulse only when actively watching to signal live state to the operator
                isWatching
                  ? 'animate-pulse bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]'
                  : 'bg-gray-300',
              )}
              aria-hidden="true"
            />
            <span className="text-sm text-gray-500">
              {isWatching ? 'Surveillance active' : 'Dossier non configuré'}
            </span>
          </div>

          {/* Print button */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={!hasPhoto}
            className={cn(
              'inline-flex items-center gap-2.5 rounded-full px-8 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.97]',
              hasPhoto
                ? 'bg-gray-900 text-white hover:bg-gray-700'
                : 'cursor-not-allowed bg-gray-100 text-gray-400',
            )}
            aria-label="Imprimer la photo"
          >
            <Printer size={16} aria-hidden="true" />
            Imprimer
          </button>

          {/* Last photo timestamp */}
          <span className="w-32 text-right font-mono text-sm text-gray-400">
            {lastPhotoTime ?? '—'}
          </span>
        </footer>
      </div>

      {/* Gabarit picker modal */}
      <GabaritPicker
        isOpen={isPickerOpen}
        onClose={closePicker}
        gabarits={gabarits}
        selected={gabarit}
        onSelect={selectGabarit}
      />
    </>
  );
}
