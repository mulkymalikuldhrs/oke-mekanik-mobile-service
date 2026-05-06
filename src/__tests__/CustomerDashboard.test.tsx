import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerDashboard from '../pages/CustomerDashboard';
import { vi } from 'vitest';
import * as useLanguage from '../hooks/useLanguage';
<<<<<<< HEAD
=======
import * as AuthContext from '../contexts/AuthContext';
>>>>>>> jules-1751083910730374172-8e0c37a0

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
<<<<<<< HEAD
=======
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'cust-1', name: 'John Customer', role: 'customer' },
      isLoading: false,
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      token: 'fake-token',
      error: null,
    });
>>>>>>> jules-1751083910730374172-8e0c37a0
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
<<<<<<< HEAD
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders success state', async () => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        activeService: { mechanic: 'Test Mechanic' },
        nearbyMechanics: [{ id: 1, name: 'Nearby Mechanic' }],
        recentServices: [{ id: 1, service: 'Recent Service' }],
      }),
=======
  });

  it('renders success state', async () => {
    window.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/bookings?userId=')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([{ id: '1', status: 'otw', vehicle: { brand: 'Toyota', model: 'Avanza' }, problem: 'Ganti Ban', createdAt: new Date().toISOString() }]),
        });
      }
      if (url.includes('/mechanics')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([{ id: 'mech-1', name: 'Test Mechanic', speciality: ['Ganti Oli'], rating: 4.5, pricePerHour: 50000, isOnline: true }]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
>>>>>>> jules-1751083910730374172-8e0c37a0
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
<<<<<<< HEAD
      expect(screen.getByText('Test Mechanic sedang menuju lokasi Anda')).toBeInTheDocument();
=======
      expect(screen.getByText('dashboard.customer.heading_to_loc')).toBeInTheDocument();
>>>>>>> jules-1751083910730374172-8e0c37a0
    });
  });

  it('renders error state', async () => {
<<<<<<< HEAD
    window.fetch = vi.fn().mockRejectedValue(new Error('Network response was not ok'));
=======
    window.fetch = vi.fn().mockImplementation((url) => {
      return Promise.reject(new Error('Network response was not ok'));
    });
>>>>>>> jules-1751083910730374172-8e0c37a0

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
<<<<<<< HEAD
      expect(screen.getByText('Gagal memuat data')).toBeInTheDocument();
=======
      expect(screen.getByText('error.load_failed')).toBeInTheDocument();
>>>>>>> jules-1751083910730374172-8e0c37a0
    });
  });
});
