import { SeoHead } from '@components/features/SeoHead';
import { GabaritPanel, useGabarit } from '@features/gabarit';
import { CoverFlow, usePhotoWatcher, ViewerPanel } from '@features/photos';
import { cn } from '@utils/cn';
import { Camera, Printer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const COUNTDOWN_START = 5;

export default function Home() {
  const { selected: gabarit, gabarits, selectGabarit } = useGabarit();
  const { photos, selectedPhoto, isWatching, selectPhoto } = usePhotoWatcher();
  const [isShooting, setIsShooting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount
  useEffect(
    () => () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    },
    [],
  );

  function handleShutter() {
    if (isShooting || countdown !== null) return;
    setCountdown(COUNTDOWN_START);
  }

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      // Trigger shutter after the "0" is briefly shown
      countdownRef.current = setTimeout(() => {
        void (async () => {
          setCountdown(null);
          setIsShooting(true);
          try {
            await fetch('/api/shutter', { method: 'POST' });
          } finally {
            setIsShooting(false);
          }
        })();
      }, 600);
      return;
    }

    countdownRef.current = setTimeout(() => setCountdown(n => (n ?? 1) - 1), 1000);
  }, [countdown]);

  async function handlePrint() {
    if (!selectedPhoto) return;

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

  return (
    <>
      <SeoHead
        title="Photobooth Teixeira Jaton"
        description="Application photobooth Canon Selphy"
      />

      <div className="flex h-screen w-screen flex-col bg-neutral-900">
        {/* ── Countdown overlay ───────────────────────────────── */}
        {countdown !== null && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span
              key={countdown}
              className="font-bold text-white select-none"
              style={{
                fontSize: 'clamp(8rem, 30vw, 20rem)',
                lineHeight: 1,
                animation: 'countdownPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
              }}
            >
              {countdown === 0 ? '📸' : countdown}
            </span>
          </div>
        )}

        {/* ── 3-column main layout ────────────────────────────── */}
        <main className="flex min-h-0 flex-1 gap-4 px-6 pt-6 pb-2">
          {/* ── Col gauche : photos précédentes ─────────────── */}
          <div className="flex w-40 shrink-0 flex-col gap-3">
            <h2 className="shrink-0 text-center text-xs font-semibold tracking-widest text-neutral-500 uppercase">
              Les photos
            </h2>
            <div className="min-h-0 flex-1">
              <CoverFlow photos={photos} selectedPhoto={selectedPhoto} onSelect={selectPhoto} />
            </div>
          </div>

          {/* ── Col centre : photo + boutons ─────────────────── */}
          <div className="flex flex-1 flex-col items-center justify-center gap-5">
            {/* Photo viewer contrainte en ratio 2:3 portrait */}
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <div className="aspect-[2/3] h-full max-h-full">
                <ViewerPanel photo={selectedPhoto} gabarit={gabarit} className="h-full w-full" />
              </div>
            </div>

            {/* Boutons d'action directement sous la photo */}
            <div className="flex shrink-0 items-center gap-4">
              <button
                type="button"
                onClick={handleShutter}
                disabled={isShooting || countdown !== null}
                className={cn(
                  'inline-flex items-center gap-3 rounded-full px-10 py-4 text-base font-semibold transition-all duration-200 active:scale-[0.97]',
                  isShooting || countdown !== null
                    ? 'cursor-not-allowed bg-neutral-800 text-neutral-600'
                    : 'bg-red-500 text-white hover:bg-red-600',
                )}
                aria-label="Déclencher la photo"
              >
                <Camera size={20} aria-hidden="true" />
                {isShooting
                  ? 'Déclenchement…'
                  : countdown !== null
                    ? `Prêt dans ${countdown}…`
                    : 'Déclencher'}
              </button>

              <button
                type="button"
                onClick={() => void handlePrint()}
                disabled={!selectedPhoto}
                className={cn(
                  'inline-flex items-center gap-3 rounded-full px-10 py-4 text-base font-semibold transition-all duration-200 active:scale-[0.97]',
                  selectedPhoto
                    ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                    : 'cursor-not-allowed bg-neutral-800 text-neutral-600',
                )}
                aria-label="Imprimer la photo"
              >
                <Printer size={20} aria-hidden="true" />
                Imprimer
              </button>
            </div>
          </div>

          {/* ── Col droite : filtres / gabarits ─────────────── */}
          <div className="w-40 shrink-0">
            <GabaritPanel gabarits={gabarits} selected={gabarit} onSelect={selectGabarit} />
          </div>
        </main>

        {/* ── Footer : titre + statut ──────────────────────── */}
        <footer className="flex shrink-0 items-center justify-between px-6 py-4">
          <h1 className="text-sm font-semibold tracking-tight text-neutral-300">
            Photobooth Teixeira Jaton
          </h1>

          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                isWatching
                  ? 'animate-pulse bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]'
                  : 'bg-neutral-600',
              )}
              aria-hidden="true"
            />
            <span className="text-sm text-neutral-500">
              {isWatching ? 'Surveillance active' : 'En attente du serveur…'}
            </span>
          </div>
        </footer>
      </div>
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
