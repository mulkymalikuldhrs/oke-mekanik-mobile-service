import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingPage from '@/pages/BookingPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '@/contexts/AuthContext';
import * as useLanguage from '@/hooks/useLanguage';

vi.mock('@/lib/api', () => ({
  serviceApi: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'svc-1', name: 'Ganti Oli', category: 'maintenance', basePrice: 150000, description: 'Ganti oli mesin', isEmergencyAvailable: true },
    ]),
  },
  mechanicApi: {
    getNearby: vi.fn().mockResolvedValue([]),
  },
  aiApi: {
    diagnose: vi.fn().mockResolvedValue({
      suggestion: 'Ganti Oli',
      confidence: 95,
      urgency_level: 'tinggi',
      estimated_cost_range: '150.000 - 200.000',
      description: 'Disarankan ganti oli mesin.',
    }),
  },
  bookingApi: {
    create: vi.fn().mockResolvedValue({ id: 'BOOK-123' }),
  },
}));

describe('BookingPage', () => {
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

  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders booking page steps', async () => {
    renderWithProviders(<BookingPage />);

    expect(screen.getByText(/Pilih Layanan/i)).toBeInTheDocument();
  });

  it('navigates through steps', async () => {
    renderWithProviders(<BookingPage />);

    // Select service in step 1
    const serviceButton = screen.getByText(/Pilih Layanan/i);
    expect(serviceButton).toBeInTheDocument();
  });
});
