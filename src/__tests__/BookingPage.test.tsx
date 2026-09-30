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
      { id: 'svc-1', name: 'Ganti Oli Standard', category: 'general', basePrice: 150000, description: 'Ganti oli mesin', isEmergencyAvailable: false }
    ]),
    getById: vi.fn(),
  },
  aiApi: {
    diagnose: vi.fn().mockResolvedValue({ suggestion: 'Aman', confidence: 90, serviceId: 'svc-1' }),
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

    expect(screen.getByText(/Pesan Mekanik/i)).toBeInTheDocument();
  });

  it('navigates through steps', async () => {
    renderWithProviders(<BookingPage />);

    // Step 1: Select a service
    const serviceCard = await screen.findByText('Ganti Oli Standard');
    fireEvent.click(serviceCard);

    const step1NextButton = screen.getByText(/Lanjutkan/i);
    fireEvent.click(step1NextButton);

    // Step 2: Location & Vehicle
    await screen.findByText(/Lokasi & Kendaraan/i);

    fireEvent.change(screen.getByPlaceholderText(/Jl. Sudirman/i), { target: { value: 'Jl. Merdeka No. 1' } });

    // Select brand
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Toyota' } });

    const step2NextButton = screen.getByText(/Cari Mekanik/i);
    fireEvent.click(step2NextButton);

    // Step 3: Select Mechanic
    const mechanicHeading = await screen.findByRole('heading', { level: 2, name: /Pilih Mekanik/i });
    expect(mechanicHeading).toBeInTheDocument();
    expect(screen.getByText(/mekanik tersedia di sekitar Anda/i)).toBeInTheDocument();
  });
});
