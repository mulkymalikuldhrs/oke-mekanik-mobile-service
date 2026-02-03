
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingPage from './BookingPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/hooks/useLanguage';
import React from 'react';

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    getMechanics: vi.fn().mockResolvedValue([
      { id: 'mech_1', name: 'Ahmad Rizki', pricePerHour: 75000, isOnline: true, speciality: ['Mesin'] }
    ]),
    createBooking: vi.fn().mockResolvedValue({ id: 'BK-123' }),
    getBookingById: vi.fn(),
    getBookings: vi.fn(),
    updateBookingStatus: vi.fn(),
    getMessagesByBookingId: vi.fn(),
    sendMessage: vi.fn(),
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

    expect(screen.getByText(/Lokasi & Masalah Kendaraan/i)).toBeInTheDocument();
  });

  it('navigates through steps', async () => {
    renderWithProviders(<BookingPage />);

    const nextButton = screen.getByText(/Selanjutnya/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Pilih Mekanik/i)).toBeInTheDocument();
    });
  });
});
