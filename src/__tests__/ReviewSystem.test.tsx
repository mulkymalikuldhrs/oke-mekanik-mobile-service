import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomerDashboard from '@/pages/CustomerDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '@/contexts/AuthContext';
import * as useLanguage from '@/hooks/useLanguage';
import { reviewApi } from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  bookingApi: {
    getByUser: vi.fn().mockResolvedValue([
      {
        id: 'BOOK-1',
        status: 'completed',
        problem: 'Ganti Oli',
        vehicle: { brand: 'Toyota', model: 'Avanza' },
        createdAt: new Date().toISOString(),
        estimatedCost: 150000,
        mechanicId: 'mech-1'
      }
    ]),
  },
  mechanicApi: {
    getNearby: vi.fn().mockResolvedValue([]),
  },
  reviewApi: {
    create: vi.fn().mockResolvedValue({ id: 'REV-1' }),
    getByMechanicId: vi.fn().mockResolvedValue([]),
  },
  fetchWithAuth: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Review System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('opens the review dialog when "Beri Ulasan" is clicked', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CustomerDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const reviewButton = await screen.findByText('Beri Ulasan');
    fireEvent.click(reviewButton);

    expect(screen.getByText('BERI ULASAN')).toBeInTheDocument();
  });

  it('submits a review successfully', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CustomerDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const reviewButton = await screen.findByText('Beri Ulasan');
    fireEvent.click(reviewButton);

    const textarea = screen.getByPlaceholderText('Ceritakan pengalaman Anda...');
    fireEvent.change(textarea, { target: { value: 'Layanan sangat bagus!' } });

    const submitButton = screen.getByText('Kirim Ulasan');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(reviewApi.create).toHaveBeenCalledWith(expect.objectContaining({
        comment: 'Layanan sangat bagus!',
        rating: 5
      }));
    });
  });
});
