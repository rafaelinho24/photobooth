import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import Home from '../Home';

afterEach(cleanup);

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

  it('disables print button when no photo is loaded', () => {
    renderHome();
    expect(screen.getByRole('button', { name: /imprimer/i })).toBeDisabled();
  });

  it('renders the waiting state when no photo', () => {
    renderHome();
    expect(screen.getByText(/en attente/i)).toBeInTheDocument();
  });

  it('renders the watching status', () => {
    renderHome();
    expect(screen.getByText('Surveillance active')).toBeInTheDocument();
  });
});
