import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GabaritPicker } from '../GabaritPicker';
import type { Gabarit } from '../types';

afterEach(cleanup);

const GABARIT_MARIAGE: Gabarit = {
  id: '/src/assets/gabarits/mariage.png',
  name: 'mariage',
  url: '/mariage.png',
};
const GABARIT_SOIREE: Gabarit = {
  id: '/src/assets/gabarits/soiree.png',
  name: 'soiree',
  url: '/soiree.png',
};
const MOCK_GABARITS: Gabarit[] = [GABARIT_MARIAGE, GABARIT_SOIREE];

describe('GabaritPicker', () => {
  it('renders nothing when closed', () => {
    render(
      <GabaritPicker
        isOpen={false}
        onClose={vi.fn()}
        gabarits={MOCK_GABARITS}
        selected={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders gabarit thumbnails when open', () => {
    render(
      <GabaritPicker
        isOpen={true}
        onClose={vi.fn()}
        gabarits={MOCK_GABARITS}
        selected={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('mariage')).toBeInTheDocument();
    expect(screen.getByText('soiree')).toBeInTheDocument();
  });

  it('shows empty state when no gabarits', () => {
    render(
      <GabaritPicker
        isOpen={true}
        onClose={vi.fn()}
        gabarits={[]}
        selected={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText(/aucun gabarit/i)).toBeInTheDocument();
  });

  it('calls onSelect when a gabarit is clicked', () => {
    const onSelect = vi.fn();
    render(
      <GabaritPicker
        isOpen={true}
        onClose={vi.fn()}
        gabarits={MOCK_GABARITS}
        selected={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByRole('option', { name: /mariage/i }));
    expect(onSelect).toHaveBeenCalledWith(GABARIT_MARIAGE);
  });

  it('calls onSelect(null) when "Sans gabarit" is clicked', () => {
    const onSelect = vi.fn();
    render(
      <GabaritPicker
        isOpen={true}
        onClose={vi.fn()}
        gabarits={MOCK_GABARITS}
        selected={GABARIT_MARIAGE}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByText('Sans gabarit'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
