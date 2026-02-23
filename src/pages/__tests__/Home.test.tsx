import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Home from '../Home';

afterEach(cleanup);

// WHY: Mock fetch globally so polls to /api/photos and /api/liveview don't fail in tests
vi.stubGlobal(
  'fetch',
  vi.fn().mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({ photos: [] }),
  }),
);

// WHY: SeoHead uses useLocation() — pages need a router context in tests
function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

describe('Home', () => {
  it('renders without crashing', () => {
    expect(() => renderHome()).not.toThrow();
  });

  it('renders the photobooth heading', () => {
    renderHome();
    expect(screen.getByText('Photobooth')).toBeInTheDocument();
  });

  it('renders the print button', () => {
    renderHome();
    expect(screen.getByRole('button', { name: /imprimer/i })).toBeInTheDocument();
  });

  it('disables print button when no photo is selected', () => {
    renderHome();
    expect(screen.getByRole('button', { name: /imprimer/i })).toBeDisabled();
  });

  it('renders the gabarit button', () => {
    renderHome();
    expect(screen.getByRole('button', { name: /gabarit/i })).toBeInTheDocument();
  });

  it('renders the server waiting status when backend is offline', () => {
    renderHome();
    expect(screen.getByText(/en attente du serveur/i)).toBeInTheDocument();
  });
});
