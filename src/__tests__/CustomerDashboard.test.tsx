import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerDashboard from '../pages/CustomerDashboard';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import * as useLanguage from '../hooks/useLanguage';
import * as AuthContext from '../contexts/AuthContext';

// Mock the API
vi.mock('@/lib/api', () => ({
  bookingApi: {
    getByUser: vi.fn().mockResolvedValue([
      {
        id: '1',
        status: 'otw',
        vehicle: { brand: 'Toyota', model: 'Avanza' },
        problem: 'Ganti Ban',
        createdAt: new Date().toISOString(),
        etaMinutes: 15
      }
    ]),
    sos: vi.fn(),
  },
  mechanicApi: {
    getNearby: vi.fn().mockResolvedValue([
      { id: 'mech-1', name: 'Test Mechanic', speciality: ['Ganti Oli'], rating: 4.5, pricePerHour: 50000, isOnline: true, lat: -6.2, lng: 106.8 }
    ]),
  },
  reviewApi: {
    create: vi.fn(),
  },
  serviceApi: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'svc-1', name: 'Ganti Oli', isEmergencyAvailable: false },
      { id: 'svc-darurat', name: 'SOS', isEmergencyAvailable: true }
    ]),
  },
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
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('dashboard.customer.active_service')).toBeInTheDocument();
      expect(screen.getByText('Ganti Ban')).toBeInTheDocument();
    });
  });

  it('renders nearby mechanics', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Mechanic')).toBeInTheDocument();
    });
  });
});
