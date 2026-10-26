import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CustomerDashboard from '../pages/CustomerDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../contexts/AuthContext';
import * as useLanguage from '../hooks/useLanguage';
import { bookingApi, mechanicApi, reviewApi, serviceApi } from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  bookingApi: {
    getByUser: vi.fn(),
  },
  mechanicApi: {
    getNearby: vi.fn(),
  },
  serviceApi: {
    getAll: vi.fn().mockResolvedValue([]),
  },
  reviewApi: {
    create: vi.fn(),
    getByMechanicId: vi.fn().mockResolvedValue([]),
  }
}));

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
      t: (key: string) => key,
      language: 'id',
      setLanguage: vi.fn(),
    });
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'cust-1', name: 'John Doe', role: 'customer' },
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      isLoading: false,
      token: 'fake-token'
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('renders loading state', () => {
    vi.mocked(bookingApi.getByUser).mockReturnValue(new Promise(() => {}));
    vi.mocked(mechanicApi.getNearby).mockReturnValue(new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CustomerDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText('OKE MEKANIK v28.2')).toBeInTheDocument();
  });

  it('renders success state with active booking', async () => {
    vi.mocked(bookingApi.getByUser).mockResolvedValue([
      {
        id: '1',
        status: 'otw',
        vehicle: { brand: 'Toyota', model: 'Avanza' },
        problem: 'Ganti Ban',
        createdAt: new Date().toISOString(),
        etaMinutes: 15
      }
    ]);
    vi.mocked(mechanicApi.getNearby).mockResolvedValue([
      { id: 'mech-1', name: 'Test Mechanic', speciality: ['Ganti Oli'], rating: 4.5, pricePerHour: 50000, isOnline: true, lat: -6.2, lng: 106.8 }
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CustomerDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('dashboard.customer.active_service')).toBeInTheDocument();
      expect(screen.getByText('Ganti Ban')).toBeInTheDocument();
    });
  });
});
