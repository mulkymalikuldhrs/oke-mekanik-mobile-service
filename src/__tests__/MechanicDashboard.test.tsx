import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MechanicDashboard from '../pages/MechanicDashboard';
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

describe('MechanicDashboard', () => {
  beforeEach(() => {
    vi.spyOn(useLanguage, 'useLanguage').mockReturnValue({
      language: 'id',
      setLanguage: vi.fn(),
      t: (key) => key,
    });
<<<<<<< HEAD
=======
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'mech-1', name: 'Jane Mechanic', role: 'mechanic' },
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
          <MechanicDashboard />
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
        currentJob: { customer: 'Test Customer' },
        pendingOrders: [{ id: 1, customer: 'Pending Customer' }],
        todayStats: { completedJobs: 5 },
      }),
=======
  });

  it('renders success state', async () => {
    window.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/mechanics/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: 'mech-1', name: 'Jane Mechanic', rating: 4.8 }),
        });
      }
      if (url.includes('/bookings?mechanicId=')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([{ id: '1', status: 'accepted', vehicle: { brand: 'Toyota', model: 'Avanza' }, problem: 'Ganti Ban', location: { address: 'Test Location' } }]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
>>>>>>> jules-1751083910730374172-8e0c37a0
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
<<<<<<< HEAD
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
=======
      expect(screen.getByText('Toyota Avanza')).toBeInTheDocument();
>>>>>>> jules-1751083910730374172-8e0c37a0
    });
  });

  it('renders error state', async () => {
    window.fetch = vi.fn().mockRejectedValue(new Error('Network response was not ok'));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
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
