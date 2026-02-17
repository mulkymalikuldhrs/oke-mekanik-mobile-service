import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerDashboard from './CustomerDashboard';
import { describe, it, expect, vi } from 'vitest';

// Mock the useLanguage hook
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key) => key,
    language: 'en',
    setLanguage: vi.fn(),
  }),
}));

// Mock useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'cust-1', name: 'John Customer', role: 'customer' },
    isLoading: false,
    logout: vi.fn(),
  }),
}));

const queryClient = new QueryClient();

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CustomerDashboard />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('CustomerDashboard', () => {
  it('renders the dashboard title', async () => {
    window.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/bookings?userId=')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([]),
        });
      }
      if (url.includes('/mechanics')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    renderComponent();
    expect(await screen.findByText('Dashboard Pelanggan')).toBeInTheDocument();
  });
});
