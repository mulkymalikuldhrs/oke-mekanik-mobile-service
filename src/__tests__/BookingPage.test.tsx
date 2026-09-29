
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
    getNearby: vi.fn().mockResolvedValue([
      { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'], rating: 4.8, distance: 1.2 }
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
      { id: 'svc-1', name: 'Ganti Oli Engine', basePrice: 150000, description: 'Pengantian oli berkala' }
    ]),
    getById: vi.fn(),
  },
  aiApi: {
    diagnose: vi.fn().mockResolvedValue({
      suggestion: 'Ganti Oli Engine',
      serviceId: 'svc-1',
      confidence: 95,
      urgency_level: 'Low'
    }),
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

    expect(await screen.findByText('Pilih Layanan')).toBeInTheDocument();
  });

  it('navigates through steps', async () => {
    renderWithProviders(<BookingPage />);

    // Step 1: Select Service
    const serviceCard = await screen.findByText('Ganti Oli Engine');
    fireEvent.click(serviceCard);

    const step1NextButton = screen.getByRole('button', { name: /Lanjutkan/i });
    fireEvent.click(step1NextButton);

    // Step 2: Location & Vehicle
    await waitFor(() => {
      expect(screen.getByText('Lokasi & Kendaraan')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Jl. Sudirman No. 1, Jakarta'), {
      target: { value: 'Jl. Merdeka No. 10' },
    });

    const brandSelect = screen.getByRole('combobox');
    fireEvent.change(brandSelect, { target: { value: 'Toyota' } });

    const step2NextButton = screen.getByRole('button', { name: /Cari Mekanik/i });
    fireEvent.click(step2NextButton);

    // Step 3: Choose Mechanic
    await waitFor(() => {
      expect(screen.getByText('Pilih Mekanik')).toBeInTheDocument();
    });
  });
});
