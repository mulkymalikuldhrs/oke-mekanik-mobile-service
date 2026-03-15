import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '../pages/Index';
import * as useLanguage from '../hooks/useLanguage';
import { AuthProvider } from '@/contexts/AuthContext';
import { vi } from 'vitest';

describe('Index Page', () => {
  it('renders the main heading', () => {
    vi.spyOn(useLanguage, 'useLanguage').mockReturnValue({
      language: 'id',
      setLanguage: vi.fn(),
      t: (key) => key,
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Index />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'hero.title'
    );
  });
});
