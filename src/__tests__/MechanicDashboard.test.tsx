import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MechanicDashboard from '../pages/MechanicDashboard';
import { vi } from 'vitest';
import * as useLanguage from '../hooks/useLanguage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('MechanicDashboard', () => {
  beforeEach(() => {
    vi.spyOn(useLanguage, 'useLanguage').mockReturnValue({
      language: 'id',
      setLanguage: vi.fn(),
      t: (key) => key,
    });
  });

  afterEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  it('renders loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders success state', async () => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        currentJob: { customer: 'Test Customer' },
        pendingOrders: [{ id: 1, customer: 'Pending Customer' }],
        todayStats: { completedJobs: 5 },
      }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
  });

  it('renders error state', async () => {
    window.fetch = vi.fn().mockRejectedValue(new Error('Network response was not ok'));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MechanicDashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Gagal memuat data')).toBeInTheDocument();
    });
  });
});
