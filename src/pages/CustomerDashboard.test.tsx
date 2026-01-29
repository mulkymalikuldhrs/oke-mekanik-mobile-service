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
  it('renders the dashboard title', () => {
    renderComponent();
    expect(screen.getByText('Dashboard Pelanggan')).toBeInTheDocument();
  });
});
