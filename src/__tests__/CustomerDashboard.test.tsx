import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerDashboard from '../pages/CustomerDashboard';
import { vi } from 'vitest';
import * as useLanguage from '../hooks/useLanguage';
import * as AuthContext from '../contexts/AuthContext';

// Mock the API module
vi.mock('@/lib/api', () => ({
  bookingApi: {
    getByUser: vi.fn(),
    sos: vi.fn(),
  },
  mechanicApi: {
    getNearby: vi.fn(),
  },
  serviceApi: {
    getAll: vi.fn(),
  },
  reviewApi: {
    create: vi.fn(),
  },
}));

import { bookingApi, mechanicApi, serviceApi } from '@/lib/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('CustomerDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  it('renders loading state', () => {
    vi.mocked(bookingApi.getByUser).mockImplementation(() => new Promise(() => {}));
    vi.mocked(mechanicApi.getNearby).mockImplementation(() => new Promise(() => {}));
    vi.mocked(serviceApi.getAll).mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  it('renders success state', async () => {
    vi.mocked(bookingApi.getByUser).mockResolvedValue([
      { id: '1', status: 'otw', vehicle: { brand: 'Toyota', model: 'Avanza' }, problem: 'Ganti Ban', createdAt: new Date().toISOString() }
    ]);
    vi.mocked(mechanicApi.getNearby).mockResolvedValue([
      { id: 'mech-1', name: 'Test Mechanic', speciality: ['Ganti Oli'], rating: 4.5, pricePerHour: 50000, isOnline: true, lat: -6.2088, lng: 106.8456 }
    ]);
    vi.mocked(serviceApi.getAll).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('dashboard.customer.active_service')).toBeInTheDocument();
    });
  });

  it('renders error state gracefully', async () => {
    vi.mocked(bookingApi.getByUser).mockRejectedValue(new Error('Network response was not ok'));
    vi.mocked(mechanicApi.getNearby).mockRejectedValue(new Error('Network response was not ok'));
    vi.mocked(serviceApi.getAll).mockRejectedValue(new Error('Network response was not ok'));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('OKE MEKANIK')).toBeInTheDocument();
    });
  });
});
