import { SeoHead } from '@components/features/SeoHead';
import { GabaritPicker, useGabarit } from '@features/gabarit';
import { LiveViewPanel } from '@features/liveview';
import { PhotoStrip, usePhotoWatcher, ViewerPanel } from '@features/photos';
import { cn } from '@utils/cn';
import { ImagePlus, Printer } from 'lucide-react';

export default function Home() {
  const {
    selected: gabarit,
    gabarits,
    isPickerOpen,
    openPicker,
    closePicker,
    selectGabarit,
  } = useGabarit();
  const { photos, selectedPhoto, isWatching, selectPhoto } = usePhotoWatcher();

  async function handlePrint() {
    if (!selectedPhoto) return;

    // Composite photo + gabarit on a canvas, then send base64 to the print API
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const photoImg = await loadImage(selectedPhoto.url);
    canvas.width = photoImg.naturalWidth;
    canvas.height = photoImg.naturalHeight;
    ctx.drawImage(photoImg, 0, 0);

    if (gabarit) {
      const gabaritImg = await loadImage(gabarit.url);
      ctx.drawImage(gabaritImg, 0, 0, canvas.width, canvas.height);
    }

    const imageBase64 = canvas.toDataURL('image/jpeg', 0.95);

    await fetch('/api/print', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });
  }

  const lastPhotoTime = selectedPhoto
    ? new Date(selectedPhoto.takenAt).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <>
      <SeoHead title="Photobooth" description="Application photobooth Canon Selphy" />

      <div className="flex h-screen w-screen flex-col bg-white">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="flex shrink-0 items-center justify-between px-6 py-4">
          <h1 className="text-lg font-medium tracking-tight text-gray-900">Photobooth</h1>
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

        {/* ── Main panels (live view + viewer) ───────────────── */}
        <main className="flex min-h-0 flex-1 gap-4 px-6 pb-2">
          {/* Left: Live view camera feed */}
          <div className="flex h-full flex-1 items-center justify-center">
            {/* WHY: max-w-sm constrains portrait panel width on wide screens */}
            <div className="h-full w-full max-w-sm">
              <LiveViewPanel className="h-full w-full" />
            </div>
          </div>

          {/* Right: Selected photo with gabarit overlay */}
          <div className="flex h-full flex-1 items-center justify-center">
            <div className="h-full w-full max-w-sm">
              <ViewerPanel photo={selectedPhoto} gabarit={gabarit} className="h-full w-full" />
            </div>
          </div>
        </main>

        {/* ── Photo strip (last 10) ───────────────────────────── */}
        <section aria-label="10 dernières photos" className="h-28 shrink-0 px-6 py-2">
          <PhotoStrip photos={photos} selectedPhoto={selectedPhoto} onSelect={selectPhoto} />
        </section>

        {/* ── Footer bar ─────────────────────────────────────── */}
        <footer className="flex shrink-0 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isWatching
                  ? 'animate-pulse bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]'
                  : 'bg-gray-300',
              )}
              aria-hidden="true"
            />
            <span className="text-sm text-gray-500">
              {isWatching ? 'Surveillance active' : 'En attente du serveur…'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => void handlePrint()}
            disabled={!selectedPhoto}
            className={cn(
              'inline-flex items-center gap-2.5 rounded-full px-8 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.97]',
              selectedPhoto
                ? 'bg-gray-900 text-white hover:bg-gray-700'
                : 'cursor-not-allowed bg-gray-100 text-gray-400',
            )}
            aria-label="Imprimer la photo"
          >
            <Printer size={16} aria-hidden="true" />
            Imprimer
          </button>

          <span className="w-32 text-right font-mono text-sm text-gray-400">
            {lastPhotoTime ?? '—'}
          </span>
        </footer>
      </div>

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

// WHY: loadImage wraps HTMLImageElement in a Promise — required for Canvas API drawImage
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
