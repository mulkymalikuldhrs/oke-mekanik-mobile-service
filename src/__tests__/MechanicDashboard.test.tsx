import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MechanicDashboard from '../pages/MechanicDashboard';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as useLanguage from '../hooks/useLanguage';
import * as AuthContext from '../contexts/AuthContext';
import { bookingApi, mechanicApi, reviewApi } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  bookingApi: {
    getByMechanic: vi.fn(),
    updateStatus: vi.fn(),
  },
  mechanicApi: {
    getById: vi.fn(),
    getPendingBookings: vi.fn(),
    updateStatus: vi.fn(),
    updateLocation: vi.fn(),
  },
  reviewApi: {
    getByMechanicId: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('MechanicDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useLanguage, 'useLanguage').mockReturnValue({
      language: 'id',
      setLanguage: vi.fn(),
      t: (key) => key,
    });
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'mech-1', name: 'Jane Mechanic', role: 'mechanic' },
      isLoading: false,
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      token: 'fake-token',
      error: null,
    });

    vi.mocked(mechanicApi.getById).mockResolvedValue({ id: 'mech-1', name: 'Jane Mechanic', rating: 4.8 });
    vi.mocked(bookingApi.getByMechanic).mockResolvedValue([]);
    vi.mocked(reviewApi.getByMechanicId).mockResolvedValue([]);
    vi.mocked(mechanicApi.getPendingBookings).mockResolvedValue([]);
  });

  afterEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  it('renders dashboard with mechanic name after loading', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Jane Mechanic')).toBeInTheDocument();
    });
  });

  it('renders active booking state', async () => {
    vi.mocked(bookingApi.getByMechanic).mockResolvedValue([
      {
        id: '1',
        status: 'accepted',
        vehicle: { brand: 'Toyota', model: 'Avanza' },
        problem: 'Ganti Ban',
        location: { address: 'Test Location' },
        customer: { name: 'John Doe' },
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('PEKERJAAN AKTIF')).toBeInTheDocument();
      expect(screen.getByText('Toyota Avanza')).toBeInTheDocument();
    });
  });

  it('handles api failure gracefully', async () => {
    vi.mocked(mechanicApi.getById).mockRejectedValue(new Error('Network response was not ok'));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Mekanik')).toBeInTheDocument();
    });
  });
});
