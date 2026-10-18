
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
      { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'], rating: 4.8, distance: 1.2, etaMinutes: 10 }
    ]),
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
      { id: 'svc-1', name: 'Servis Berkala / Service Rutin', category: 'general', basePrice: 150000, description: 'Servis rutin kendaraan', estimatedDuration: 60 }
    ]),
    getById: vi.fn(),
  },
  aiApi: {
    diagnose: vi.fn().mockResolvedValue({ suggestion: 'Servis Berkala', confidence: 95, serviceId: 'svc-1', urgency_level: 'medium' })
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

    // Step 1: Select Service
    const serviceCard = await screen.findByText('Servis Berkala / Service Rutin');
    fireEvent.click(serviceCard);

    const step1Next = screen.getByRole('button', { name: /Lanjutkan/i });
    fireEvent.click(step1Next);

    // Step 2: Location & Vehicle
    await waitFor(() => {
      expect(screen.getByText(/Lokasi & Kendaraan/i)).toBeInTheDocument();
    });

    const addressInput = screen.getByPlaceholderText(/Jl. Sudirman No. 1, Jakarta/i);
    fireEvent.change(addressInput, { target: { value: 'Jl. Merdeka No. 1' } });

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Toyota' } });

    const step2Next = screen.getByRole('button', { name: /Cari Mekanik/i });
    fireEvent.click(step2Next);

    // Step 3: Choose Mechanic
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /Pilih Mekanik/i })).toBeInTheDocument();
    });
  });
});
