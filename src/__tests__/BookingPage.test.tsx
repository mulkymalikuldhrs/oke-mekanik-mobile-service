
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
      { id: 'svc-1', name: 'Ganti Oli', basePrice: 150000, category: 'engine', description: 'Ganti oli mesin', isEmergencyAvailable: false }
    ]),
    getById: vi.fn(),
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

    expect(await screen.findByText(/Pilih Layanan/i)).toBeInTheDocument();
  });

  it('navigates through steps', async () => {
    renderWithProviders(<BookingPage />);

    // Select service in Step 1
    const serviceOption = await screen.findByText('Ganti Oli');
    fireEvent.click(serviceOption);

    const step1Next = screen.getByRole('button', { name: /Lanjutkan/i });
    fireEvent.click(step1Next);

    // Step 2: Fill location & vehicle
    await waitFor(() => {
      expect(screen.getByText(/Lokasi & Kendaraan/i)).toBeInTheDocument();
    });

    const addressInput = screen.getByPlaceholderText(/Jl. Sudirman No. 1, Jakarta/i);
    fireEvent.change(addressInput, { target: { value: 'Jl. Merdeka No. 1' } });

    const brandSelect = screen.getByRole('combobox');
    fireEvent.change(brandSelect, { target: { value: 'Toyota' } });

    const step2Next = screen.getByRole('button', { name: /Cari Mekanik/i });
    fireEvent.click(step2Next);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Pilih Mekanik/i })).toBeInTheDocument();
    });
  });
});
