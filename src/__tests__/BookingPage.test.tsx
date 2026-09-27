
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
      { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'], rating: 4.8, lat: -6.2088, lng: 106.8456 }
    ]),
    getById: vi.fn(),
    updateStatus: vi.fn(),
  },
  bookingApi: {
    create: vi.fn().mockResolvedValue({ id: 'BK-123' }),
    getById: vi.fn(),
    getByUser: vi.fn(),
    getByMechanic: vi.fn(),
    updateStatus: vi.fn(),
    getActiveServices: vi.fn(),
  },
  serviceApi: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'svc-1', name: 'Ganti Oli', category: 'Mesin', price: 150000, description: 'Ganti oli mesin berkala' }
    ]),
    getById: vi.fn(),
  },
  aiApi: {
    diagnose: vi.fn().mockResolvedValue({
      diagnosis: 'Oli mesin sudah kotor',
      suggestedCategory: 'Mesin',
      suggestedService: 'Ganti Oli',
      confidence: 95
    })
  },
  messageApi: {
    getByBookingId: vi.fn(),
    send: vi.fn(),
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

    expect(screen.getByText('Pilih Layanan')).toBeInTheDocument();
  });

  it('navigates through steps', async () => {
    renderWithProviders(<BookingPage />);

    // Step 1: Select a service
    const serviceOption = await screen.findByText('Ganti Oli');
    fireEvent.click(serviceOption);

    const nextButtonStep1 = screen.getByText(/Lanjutkan/i);
    fireEvent.click(nextButtonStep1);

    // Step 2: Fill in location & vehicle details
    await waitFor(() => {
      expect(screen.getByText('Lokasi & Kendaraan')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Jl. Sudirman No. 1, Jakarta'), { target: { value: 'Jl. Merdeka No. 1' } });

    // Select brand
    const selectBrand = screen.getByRole('combobox');
    fireEvent.change(selectBrand, { target: { value: 'Toyota' } });

    fireEvent.change(screen.getByPlaceholderText(/Avanza, Vario/i), { target: { value: 'Avanza' } });

    const nextButtonStep2 = screen.getByText(/Cari Mekanik/i);
    fireEvent.click(nextButtonStep2);

    await waitFor(() => {
      expect(screen.getByText('Pilih Mekanik')).toBeInTheDocument();
    });
  });
});
