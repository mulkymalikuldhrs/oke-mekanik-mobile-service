import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MechanicDashboard from '../pages/MechanicDashboard';
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

describe('MechanicDashboard', () => {
  beforeEach(() => {
    vi.spyOn(useLanguage, 'useLanguage').mockReturnValue({
      language: 'id',
      setLanguage: vi.fn(),
      t: (key) => key,
    });
    vi.spyOn(useAuth, 'useAuth').mockReturnValue({
      user: { id: 'mech-1-user', name: 'Jane Mechanic', role: 'mechanic', email: 'jane@example.com' },
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
    vi.spyOn(api.mechanicApi, 'getById').mockResolvedValue({ id: 'mech-1', name: 'Jane Mechanic' } as any);
    vi.spyOn(api.bookingApi, 'getByMechanic').mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText('Dashboard Mekanik')).toBeInTheDocument();
  });

  it('renders success state with bookings', async () => {
    const mockBookings = [
      { id: '1', status: 'accepted', problem: 'Ganti Oli', vehicle: { brand: 'Toyota', model: 'Avanza' }, userId: 'cust-1' }
    ];

    vi.spyOn(api.mechanicApi, 'getById').mockResolvedValue({ id: 'mech-1', name: 'Jane Mechanic' } as any);
    vi.spyOn(api.bookingApi, 'getByMechanic').mockResolvedValue(mockBookings as any);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Pekerjaan Saat Ini')).toBeInTheDocument();
      expect(screen.getByText('Ganti Oli')).toBeInTheDocument();
    });
  });
});
