import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingPage from '../pages/BookingPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/hooks/useLanguage';
import React from 'react';

// Mock the API
vi.mock('@/lib/api', () => ({
  mechanicApi: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'], rating: 4.8 }
    ]),
    getById: vi.fn(),
    getNearby: vi.fn().mockResolvedValue([
        { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'], rating: 4.8 }
    ]),
    updateStatus: vi.fn(),
    autoDispatch: vi.fn(),
  },
  bookingApi: {
    create: vi.fn().mockResolvedValue({ id: 'BK-123' }),
    getById: vi.fn(),
    getByUser: vi.fn(),
    getByMechanic: vi.fn(),
    updateStatus: vi.fn(),
    getActiveServices: vi.fn(),
    autoDispatch: vi.fn(),
    sos: vi.fn(),
  },
  serviceApi: {
    getAll: vi.fn().mockResolvedValue([
        { id: 'svc-1', name: 'Ganti Oli', basePrice: 75000, category: 'engine', description: 'Ganti oli mesin' }
    ]),
    getById: vi.fn(),
  },
  messageApi: {
    getByBookingId: vi.fn(),
    send: vi.fn(),
  },
  aiApi: {
    diagnose: vi.fn(),
  },
  userApi: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
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

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            {ui}
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

describe('BookingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders booking page steps', async () => {
    renderWithProviders(<BookingPage />);
    await waitFor(() => {
        expect(screen.getByText(/Ganti Oli/i)).toBeInTheDocument();
    });
  });

  it('navigates through steps', async () => {
    renderWithProviders(<BookingPage />);

    await waitFor(() => {
        expect(screen.getByText(/Ganti Oli/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Ganti Oli/i));
    fireEvent.click(screen.getByText(/Lanjutkan/i));

    await waitFor(() => {
        expect(screen.getByText(/Di mana Anda butuh mekanik/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Jl. Sudirman No. 1, Jakarta/i), { target: { value: 'Jl. Merdeka No. 1' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByPlaceholderText(/Avanza, Vario.../i), { target: { value: 'Avanza' } });

    fireEvent.click(screen.getByText(/Cari Mekanik/i));

    await waitFor(() => {
      expect(screen.getByText(/Auto-Assign/i)).toBeInTheDocument();
    });
  });
});
