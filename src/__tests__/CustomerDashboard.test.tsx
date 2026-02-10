import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerDashboard from '../pages/CustomerDashboard';
import { vi } from 'vitest';
import * as useLanguage from '../hooks/useLanguage';
import * as useAuth from '../contexts/AuthContext';
import * as api from '../lib/api';

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
    vi.spyOn(useAuth, 'useAuth').mockReturnValue({
      user: { id: 'cust-1', name: 'John Doe', role: 'customer', email: 'john@example.com' },
      token: 'fake-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  it('renders the dashboard title', async () => {
    vi.spyOn(api.bookingApi, 'getByUser').mockResolvedValue([]);
    vi.spyOn(api.mechanicApi, 'getAll').mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText('Dashboard Pelanggan')).toBeInTheDocument();
  });

  it('renders success state with bookings', async () => {
    const mockBookings = [
      { id: '1', status: 'accepted', problem: 'Ganti Oli', vehicle: { brand: 'Toyota', model: 'Avanza' } }
    ];
    const mockMechanics = [
      { id: 'mech-1', name: 'Jane Mechanic', speciality: ['Ganti Oli'], rating: 4.8, pricePerHour: 75000, isOnline: true }
    ];

    vi.spyOn(api.bookingApi, 'getByUser').mockResolvedValue(mockBookings as any);
    vi.spyOn(api.mechanicApi, 'getAll').mockResolvedValue(mockMechanics as any);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Layanan Aktif - ACCEPTED')).toBeInTheDocument();
      expect(screen.getByText('Jane Mechanic')).toBeInTheDocument();
    });
  });
});
