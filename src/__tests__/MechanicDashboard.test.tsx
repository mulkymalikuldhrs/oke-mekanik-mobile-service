import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MechanicDashboard from '../pages/MechanicDashboard';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import * as useLanguage from '../hooks/useLanguage';
import * as AuthContext from '../contexts/AuthContext';
import { mechanicApi, bookingApi, reviewApi } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  mechanicApi: {
    getById: vi.fn(),
    getPendingBookings: vi.fn(),
    updateStatus: vi.fn(),
    updateLocation: vi.fn(),
  },
  bookingApi: {
    getByMechanic: vi.fn(),
    updateStatus: vi.fn(),
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
      t: (key: string) => key,
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
  });

  afterEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(mechanicApi.getById).mockImplementation(() => new Promise(() => {}));
    vi.mocked(bookingApi.getByMechanic).mockImplementation(() => new Promise(() => {}));
    vi.mocked(reviewApi.getByMechanicId).mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  it('renders success state', async () => {
    vi.mocked(mechanicApi.getById).mockResolvedValue({
      id: 'mech-1',
      name: 'Jane Mechanic',
      rating: 4.8,
    } as any);

    vi.mocked(bookingApi.getByMechanic).mockResolvedValue([
      {
        id: '1',
        status: 'accepted',
        vehicle: { brand: 'Toyota', model: 'Avanza' },
        problem: 'Ganti Ban',
        location: { address: 'Test Location' },
      },
    ] as any);

    vi.mocked(reviewApi.getByMechanicId).mockResolvedValue([]);
    vi.mocked(mechanicApi.getPendingBookings).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Toyota Avanza')).toBeInTheDocument();
    });
  });

  it('renders dashboard layout when API returns empty or fails', async () => {
    vi.mocked(mechanicApi.getById).mockRejectedValue(new Error('Fetch failed'));
    vi.mocked(bookingApi.getByMechanic).mockResolvedValue([]);
    vi.mocked(reviewApi.getByMechanicId).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('OKE MEKANIK')).toBeInTheDocument();
    });
  });
});
