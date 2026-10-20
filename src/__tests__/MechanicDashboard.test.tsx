import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MechanicDashboard from '@/pages/MechanicDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '@/contexts/AuthContext';
import * as useLanguage from '@/hooks/useLanguage';

vi.mock('@/lib/api', () => ({
  mechanicApi: {
    getById: vi.fn().mockResolvedValue({
      id: 'mech-1',
      name: 'John Mechanic',
      rating: 4.8,
      speciality: ['Engine', 'Brakes'],
    }),
    getPendingBookings: vi.fn().mockResolvedValue([]),
    updateStatus: vi.fn(),
    updateLocation: vi.fn(),
  },
  bookingApi: {
    getByMechanic: vi.fn().mockResolvedValue([
      {
        id: 'BOOK-1',
        status: 'accepted',
        problem: 'Brake Failure',
        customer: { name: 'Alice' },
        vehicle: { brand: 'Toyota', model: 'Camry' },
        location: { address: '123 Main St' },
      },
    ]),
    updateStatus: vi.fn(),
  },
  reviewApi: {
    getByMechanicId: vi.fn().mockResolvedValue([
      { id: 'REV-1', rating: 5, comment: 'Great service!' },
    ]),
  },
}));

describe('MechanicDashboard', () => {
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
      user: { id: 'mech-1', name: 'John Mechanic', email: 'john@mechanic.com', role: 'mechanic' },
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      isLoading: false,
      token: 'fake-token'
    });
  });

  it('renders loading state', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MechanicDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders success state', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MechanicDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Mechanic')).toBeInTheDocument();
      expect(screen.getByText('PEKERJAAN AKTIF')).toBeInTheDocument();
      expect(screen.getByText('Brake Failure')).toBeInTheDocument();
    });
  });

  it('renders error state gracefully', async () => {
    window.fetch = vi.fn().mockRejectedValue(new Error('Network response was not ok'));

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MechanicDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('OKE MEKANIK')).toBeInTheDocument();
    });
  });
});
