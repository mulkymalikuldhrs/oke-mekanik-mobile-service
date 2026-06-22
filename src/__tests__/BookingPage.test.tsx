import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingPage from '../pages/BookingPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/hooks/useLanguage';
import React from 'react';
import { serviceApi, mechanicApi } from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  mechanicApi: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'], rating: 4.8, lat: -6.2, lng: 106.8 }
    ]),
    getNearby: vi.fn().mockResolvedValue([
        { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'], rating: 4.8, lat: -6.2, lng: 106.8 }
    ]),
    getById: vi.fn(),
    updateStatus: vi.fn(),
  },
  bookingApi: {
    create: vi.fn().mockResolvedValue({ id: 'BK-123' }),
    getById: vi.fn(),
    getByUser: vi.fn().mockResolvedValue([]),
    getByMechanic: vi.fn(),
    updateStatus: vi.fn(),
    getActiveServices: vi.fn().mockResolvedValue([]),
  },
  serviceApi: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn(),
  },
  messageApi: {
    getByBookingId: vi.fn(),
    send: vi.fn(),
  },
  aiApi: {
    diagnose: vi.fn()
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

    expect(screen.getByText(/booking.step1.title/i)).toBeInTheDocument();
  });

  it('navigates through steps', async () => {
    renderWithProviders(<BookingPage />);

    // Fill in required fields to enable "Lanjutkan"
    fireEvent.change(screen.getByPlaceholderText(/booking.step1.address_placeholder/i), { target: { value: 'Jl. Merdeka No. 1' } });

    // Select brand - note we use the key because of Translation mock
    const brandSelect = screen.getByLabelText(/booking.step1.brand/i);
    fireEvent.change(brandSelect, { target: { value: 'Toyota' } });

    fireEvent.change(screen.getByPlaceholderText(/booking.step1.model_placeholder/i), { target: { value: 'Avanza' } });

    const nextButton = screen.getByText(/booking.step1.next/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/booking.step2.title/i)).toBeInTheDocument();
    });
  });
});
