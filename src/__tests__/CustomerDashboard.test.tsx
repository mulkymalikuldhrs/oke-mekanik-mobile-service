import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerDashboard from '../pages/CustomerDashboard';
import { vi } from 'vitest';
import * as useLanguage from '../hooks/useLanguage';
import * as AuthContext from '../contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('CustomerDashboard', () => {
  beforeEach(() => {
    vi.spyOn(useLanguage, 'useLanguage').mockReturnValue({
      language: 'id',
      setLanguage: vi.fn(),
      t: (key) => key,
    });
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'cust-1', name: 'John Customer', role: 'customer' },
      isLoading: false,
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      token: 'fake-token',
      error: null,
    });
  });

  afterEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  it('renders loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText('OKE MEKANIK')).toBeInTheDocument();
  });

  it('renders success state', async () => {
    window.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/bookings/active')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([{ id: '1', status: 'otw', mechanicId: 'mech-1', vehicle: { brand: 'Toyota', model: 'Avanza' }, problem: 'Ganti Ban', createdAt: new Date().toISOString() }]),
        });
      }
      if (url.includes('/bookings?userId=')) {
        return Promise.resolve({
            ok: true,
            json: async () => ([]),
        });
      }
      if (url.includes('/mechanics')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([{ id: 'mech-1', name: 'Test Mechanic', speciality: ['Ganti Oli'], rating: 4.5, price_per_hour: 50000, is_online: 1 }]),
        });
      }
      return Promise.reject(new Error('Unknown URL: ' + url));
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Layanan Aktif')).toBeInTheDocument();
      expect(screen.getByText('Test Mechanic')).toBeInTheDocument();
    });
  });
});
