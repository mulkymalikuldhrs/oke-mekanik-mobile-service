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
  });

  it('renders success state', async () => {
    window.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/bookings')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ([{ id: '1', status: 'otw', vehicle: { brand: 'Toyota', model: 'Avanza' }, problem: 'Ganti Ban', createdAt: new Date().toISOString(), location: { address: 'Test Location' } }]),
        });
      }
      if (url.includes('/mechanics')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ([{ id: 'mech-1', name: 'Test Mechanic', speciality: ['Ganti Oli'], rating: 4.5, pricePerHour: 50000, isOnline: true }]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/dashboard.customer.active_service/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders error state', async () => {
    window.fetch = vi.fn().mockImplementation((url) => {
      return Promise.reject(new Error('Network response was not ok'));
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('error.load_failed')).toBeInTheDocument();
    });
  });
});
