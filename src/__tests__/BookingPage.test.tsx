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
    getNearby: vi.fn().mockResolvedValue([
      { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'], rating: 4.8 }
    ]),
    getAll: vi.fn().mockResolvedValue([
      { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'], rating: 4.8 }
    ]),
    getById: vi.fn(),
    updateStatus: vi.fn(),
  },
  bookingApi: {
    create: vi.fn().mockResolvedValue({ id: 'BK-123' }),
    autoDispatch: vi.fn().mockResolvedValue({ id: 'BK-123' }),
    getById: vi.fn(),
    getByUser: vi.fn(),
    getByMechanic: vi.fn(),
    updateStatus: vi.fn(),
    getActiveServices: vi.fn(),
  },
  serviceApi: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'svc-1', name: 'Ganti Oli Engine', category: 'engine', basePrice: 150000, description: 'Ganti oli mesin', estimatedDuration: 30 }
    ]),
    getById: vi.fn(),
  },
  aiApi: {
    diagnose: vi.fn().mockResolvedValue({ suggestion: 'Tune Up', serviceId: 'svc-1', confidence: 95, urgency_level: 'MEDIUM' }),
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

    expect(screen.getByText(/Pilih Layanan/i)).toBeInTheDocument();
  });

  it('navigates through steps', async () => {
    renderWithProviders(<BookingPage />);

    // Step 1: Select service
    const serviceOption = await screen.findByText('Ganti Oli Engine');
    fireEvent.click(serviceOption);

    const nextStep1Button = screen.getByText(/Lanjutkan/i);
    fireEvent.click(nextStep1Button);

    // Step 2: Fill Location & Vehicle
    await waitFor(() => {
      expect(screen.getByText(/Lokasi & Kendaraan/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Jl. Sudirman No. 1, Jakarta/i), { target: { value: 'Jl. Merdeka No. 1' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Toyota' } });

    const searchMechanicButton = screen.getByText(/Cari Mekanik/i);
    fireEvent.click(searchMechanicButton);

    // Step 3: Choose mechanic
    await waitFor(() => {
      expect(screen.getByText(/Auto-Assign \(Rekomendasi\)/i)).toBeInTheDocument();
    });
  });
});
