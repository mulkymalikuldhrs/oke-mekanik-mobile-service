import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MechanicDashboard from '../pages/MechanicDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../contexts/AuthContext';
import * as useLanguage from '../hooks/useLanguage';
import { mechanicApi, bookingApi, reviewApi } from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  mechanicApi: {
    getById: vi.fn(),
    getByUser: vi.fn(),
    getPendingBookings: vi.fn().mockResolvedValue([]),
    updateStatus: vi.fn(),
    updateLocation: vi.fn(),
  },
  bookingApi: {
    getByMechanic: vi.fn().mockResolvedValue([]),
    updateStatus: vi.fn(),
  },
  reviewApi: {
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

describe('MechanicDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useLanguage, 'useLanguage').mockReturnValue({
      t: (key: string) => key,
      language: 'id',
      setLanguage: vi.fn(),
    });
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'mech-1', name: 'Mekanik Handal', role: 'mechanic' },
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
    vi.mocked(mechanicApi.getById).mockReturnValue(new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MechanicDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );
  });

  it('renders success state', async () => {
    vi.mocked(mechanicApi.getById).mockResolvedValue({
      id: 'mech-1',
      name: 'Mekanik Handal',
      rating: 4.8,
      isOnline: true
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MechanicDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/OKE MEKANIK v28.2/)).toBeInTheDocument();
      expect(screen.getByText(/Mekanik Handal/)).toBeInTheDocument();
    });
  });
});
