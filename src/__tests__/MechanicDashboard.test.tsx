import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MechanicDashboard from '../pages/MechanicDashboard';
import { vi } from 'vitest';
import * as useLanguage from '../hooks/useLanguage';
import * as AuthContext from '../contexts/AuthContext';

// Mock the API
vi.mock('@/lib/api', () => ({
  mechanicApi: {
    getById: vi.fn(),
    getPendingBookings: vi.fn().mockResolvedValue([]),
    updateStatus: vi.fn(),
    updateLocation: vi.fn(),
  },
  bookingApi: {
    getByMechanic: vi.fn(),
    updateStatus: vi.fn(),
  },
  reviewApi: {
    getByMechanicId: vi.fn().mockResolvedValue([]),
  },
}));

import { mechanicApi, bookingApi } from '@/lib/api';

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
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('renders loading state', () => {
    vi.mocked(mechanicApi.getById).mockImplementation(() => new Promise(() => {}));
    vi.mocked(bookingApi.getByMechanic).mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  it('renders success state', async () => {
    vi.mocked(mechanicApi.getById).mockResolvedValue({ id: 'mech-1', name: 'Jane Mechanic', rating: 4.8 });
    vi.mocked(bookingApi.getByMechanic).mockResolvedValue([
      { id: '1', status: 'accepted', vehicle: { brand: 'Toyota', model: 'Avanza' }, problem: 'Ganti Ban', location: { address: 'Test Location' } }
    ]);

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

  it('renders error state', async () => {
    vi.mocked(mechanicApi.getById).mockRejectedValue(new Error('Network response was not ok'));
    vi.mocked(bookingApi.getByMechanic).mockRejectedValue(new Error('Network response was not ok'));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // In MechanicDashboard, error state still displays dashboard skeleton/elements
    await waitFor(() => {
      expect(screen.getByText('OKE MEKANIK')).toBeInTheDocument();
    });
  });
});
