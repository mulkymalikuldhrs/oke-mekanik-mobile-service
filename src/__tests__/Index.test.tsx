import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '../pages/Index';
import * as useLanguage from '../hooks/useLanguage';
<<<<<<< HEAD
=======
import { AuthProvider } from '@/contexts/AuthContext';
>>>>>>> jules-1751083910730374172-8e0c37a0
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
<<<<<<< HEAD
        <Index />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'hero.title'
    );
=======
        <AuthProvider>
          <Index />
        </AuthProvider>
      </MemoryRouter>
    );
    // In v28, the heading contains multiple spans/elements for styling
    expect(screen.getByText(/OKE MEKANIK v28/i)).toBeInTheDocument();
>>>>>>> jules-1751083910730374172-8e0c37a0
  });
});
