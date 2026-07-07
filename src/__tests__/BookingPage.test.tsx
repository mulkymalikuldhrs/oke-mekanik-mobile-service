import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingPage from '../pages/BookingPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../contexts/AuthContext';
import * as useLanguage from '../hooks/useLanguage';

// Mock the API
vi.mock('@/lib/api', () => ({
  serviceApi: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'svc-1', name: 'Ganti Oli', category: 'engine', basePrice: 150000, estimatedDuration: 30 }
    ]),
  },
  mechanicApi: {
    getNearby: vi.fn().mockResolvedValue([]),
  },
  aiApi: {
    diagnose: vi.fn(),
  },
  bookingApi: {
    create: vi.fn(),
    autoDispatch: vi.fn(),
  }
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('BookingPage', () => {
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

  it('renders booking page steps', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <BookingPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('PESAN MEKANIK v28.2')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Ganti Oli')).toBeInTheDocument();
    });
  });

  it('navigates through steps', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <BookingPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Ganti Oli'));
    fireEvent.click(screen.getByText('Ganti Oli'));

    const nextButton = screen.getByText(/Lanjutkan/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Lokasi & Kendaraan')).toBeInTheDocument();
    });
  });
});
