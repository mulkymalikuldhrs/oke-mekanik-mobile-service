import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CustomerDashboard from '@/pages/CustomerDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '@/contexts/AuthContext';
import * as useLanguage from '@/hooks/useLanguage';

vi.mock('@/lib/api', () => ({
  bookingApi: {
    getByUser: vi.fn().mockResolvedValue([
      {
        id: 'BOOK-1',
        status: 'otw',
        problem: 'Ganti Ban',
        vehicle: { brand: 'Honda', model: 'Civic' },
        createdAt: new Date().toISOString(),
        estimatedCost: 200000,
        mechanicId: 'mech-1'
      }
    ]),
  },
  mechanicApi: {
    getNearby: vi.fn().mockResolvedValue([]),
  },
  serviceApi: {
    getAll: vi.fn().mockResolvedValue([]),
  },
  reviewApi: {
    getByMechanicId: vi.fn().mockResolvedValue([]),
  },
}));

describe('CustomerDashboard', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    vi.spyOn(useLanguage, 'useLanguage').mockReturnValue({
      t: (key: string) => key,
      language: 'id',
      setLanguage: vi.fn(),
    });

    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'cust-1', name: 'John Doe', email: 'john@example.com', role: 'customer' },
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      isLoading: false,
      token: 'fake-token'
    });
  });

  it('renders loading state', async () => {
    window.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CustomerDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('OKE MEKANIK')).toBeInTheDocument();
  });

  it('renders success state', async () => {
    window.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/mechanics')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([{ id: 'mech-1', name: 'Test Mechanic', speciality: ['Ganti Oli'], rating: 4.5, pricePerHour: 50000, isOnline: true, lat: -6.2088, lng: 106.8456 }]),
        });
      }
      if (url.includes('/services')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CustomerDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Ganti Ban')).toBeInTheDocument();
    });
  });

  it('renders error state gracefully', async () => {
    window.fetch = vi.fn().mockImplementation(() => {
      return Promise.reject(new Error('Network response was not ok'));
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CustomerDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('OKE MEKANIK')).toBeInTheDocument();
    });
  });
});
