import { Booking, Mechanic, Message, User, UserRole } from '@/types';

// Environment-based API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
<<<<<<< HEAD
=======
  if (import.meta.env.DEV) {
    console.log(`[API Request] ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body as string) : '');
  }

>>>>>>> jules-1751083910730374172-8e0c37a0
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
<<<<<<< HEAD
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
=======
    const error = await response.json().catch(() => ({ message: null }));

    if (import.meta.env.DEV) {
      console.error(`[API Error] ${options.method || 'GET'} ${url}`, error);
    }

    if (response.status === 401) {
      throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
    } else if (response.status === 403) {
      throw new Error('Anda tidak memiliki akses untuk melakukan tindakan ini.');
    } else if (response.status === 404) {
      throw new Error('Data tidak ditemukan.');
    } else if (response.status === 500) {
      throw new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
    }

    throw new Error(error.message || `Terjadi kesalahan (Status: ${response.status})`);
  }

  const data = await response.json();
  if (import.meta.env.DEV) {
    console.log(`[API Response] ${options.method || 'GET'} ${url}`, data);
  }
  return data;
>>>>>>> jules-1751083910730374172-8e0c37a0
}

// Auth API
export const authApi = {
  login: async (email: string, password: string, role: UserRole): Promise<{ user: User; token: string }> => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
  }): Promise<{ user: User; token: string }> => {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async (): Promise<void> => {
<<<<<<< HEAD
    return fetchApi('/auth/logout', { method: 'POST' });
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return fetchApi('/auth/refresh', { method: 'POST' });
=======
    return fetchApi('/auth/logout', { method: 'POST' }).catch(() => {}); // Optional logout
  },

  getMe: async (): Promise<User> => {
    return fetchWithAuth('/auth/me');
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return fetchWithAuth('/auth/refresh', { method: 'POST' });
>>>>>>> jules-1751083910730374172-8e0c37a0
  },
};

// Mechanics API
export const mechanicApi = {
  getAll: async (): Promise<Mechanic[]> => {
    return fetchApi('/mechanics');
  },

  getById: async (id: string): Promise<Mechanic> => {
    return fetchApi(`/mechanics/${id}`);
  },

  getNearby: async (lat: number, lng: number, radiusKm: number = 10): Promise<Mechanic[]> => {
<<<<<<< HEAD
    return fetchApi(`/mechanics/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
  },

  updateStatus: async (id: string, isOnline: boolean): Promise<void> => {
    return fetchApi(`/mechanics/${id}/status`, {
=======
    return fetchApi(`/mechanics/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`).catch(() => mechanicApi.getAll());
  },

  updateStatus: async (id: string, isOnline: boolean): Promise<void> => {
    return fetchWithAuth(`/mechanics/${id}/status`, {
>>>>>>> jules-1751083910730374172-8e0c37a0
      method: 'PATCH',
      body: JSON.stringify({ isOnline }),
    });
  },
<<<<<<< HEAD
=======

  updateLocation: async (id: string, lat: number, lng: number): Promise<void> => {
    return fetchWithAuth(`/mechanics/${id}/location`, {
      method: 'PATCH',
      body: JSON.stringify({ lat, lng }),
    });
  },

  register: async (data: {
    speciality: string;
    experience: number;
    phone: string;
    identityNumber: string;
    bio: string;
  }): Promise<{ success: boolean; mechanicId: string }> => {
    return fetchWithAuth('/mechanics/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
>>>>>>> jules-1751083910730374172-8e0c37a0
};

// Bookings API
export const bookingApi = {
  create: async (bookingData: {
    mechanicId: string;
    serviceId: string;
    vehicle: { brand: string; model: string; year: string; licensePlate: string };
    problem: string;
    location: { lat: number; lng: number; address: string };
    scheduledAt?: string;
    isEmergency?: boolean;
  }): Promise<Booking> => {
<<<<<<< HEAD
    return fetchApi('/bookings', {
=======
    return fetchWithAuth('/bookings', {
>>>>>>> jules-1751083910730374172-8e0c37a0
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getById: async (id: string): Promise<Booking> => {
<<<<<<< HEAD
    return fetchApi(`/bookings/${id}`);
  },

  getByUser: async (userId: string): Promise<Booking[]> => {
    return fetchApi(`/bookings?userId=${userId}`);
  },

  getByMechanic: async (mechanicId: string): Promise<Booking[]> => {
    return fetchApi(`/bookings?mechanicId=${mechanicId}`);
  },

  updateStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    return fetchApi(`/bookings/${id}/status`, {
=======
    return fetchWithAuth(`/bookings/${id}`);
  },

  getByUser: async (userId: string): Promise<Booking[]> => {
    return fetchWithAuth(`/bookings?userId=${userId}`);
  },

  getByMechanic: async (mechanicId: string): Promise<Booking[]> => {
    return fetchWithAuth(`/bookings?mechanicId=${mechanicId}`);
  },

  updateStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    return fetchWithAuth(`/bookings/${id}/status`, {
>>>>>>> jules-1751083910730374172-8e0c37a0
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getActiveServices: async (): Promise<Booking[]> => {
<<<<<<< HEAD
    return fetchApi('/bookings/active');
=======
    return fetchWithAuth('/bookings/active');
>>>>>>> jules-1751083910730374172-8e0c37a0
  },
};

// Messages API
export const messageApi = {
  getByBookingId: async (bookingId: string): Promise<Message[]> => {
<<<<<<< HEAD
    return fetchApi(`/messages?bookingId=${bookingId}`);
=======
    return fetchWithAuth(`/messages?bookingId=${bookingId}`);
>>>>>>> jules-1751083910730374172-8e0c37a0
  },

  send: async (messageData: {
    bookingId: string;
    text: string;
<<<<<<< HEAD
    senderId: string;
  }): Promise<Message> => {
    return fetchApi('/messages', {
=======
  }): Promise<Message> => {
    return fetchWithAuth('/messages', {
>>>>>>> jules-1751083910730374172-8e0c37a0
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// User API
export const userApi = {
  getProfile: async (userId: string): Promise<User> => {
<<<<<<< HEAD
    return fetchApi(`/users/${userId}`);
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    return fetchApi(`/users/${userId}`, {
=======
    return fetchWithAuth(`/users/${userId}`);
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    return fetchWithAuth(`/users/${userId}`, {
>>>>>>> jules-1751083910730374172-8e0c37a0
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Service Types API
export const serviceApi = {
  getAll: async (): Promise<{ id: string; name: string; description: string; basePrice: number }[]> => {
    return fetchApi('/services');
  },

  getById: async (id: string): Promise<{ id: string; name: string; description: string; basePrice: number }> => {
    return fetchApi(`/services/${id}`);
  },
};

<<<<<<< HEAD
// Payments API
export const paymentApi = {
  create: async (paymentData: {
    bookingId: number;
    amount: number;
    paymentMethod: string;
    status: string;
  }): Promise<{ id: number; status: string }> => {
    return fetchApi('/payments', {
=======
// AI API
export const aiApi = {
  diagnose: async (problem: string): Promise<{
    suggestion: string;
    serviceId: string;
    confidence: number;
    possible_causes: string[];
    urgency_level: string;
    version: string;
  }> => {
    return fetchApi('/ai/diagnose', {
      method: 'POST',
      body: JSON.stringify({ problem }),
    });
  },
};

// Payments API
export const paymentApi = {
  create: async (paymentData: {
    bookingId: string;
    amount: number;
    paymentMethod: string;
    status: string;
  }): Promise<{ id: string; status: string }> => {
    return fetchWithAuth('/payments', {
>>>>>>> jules-1751083910730374172-8e0c37a0
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

<<<<<<< HEAD
  getByBookingId: async (bookingId: string): Promise<{ id: number; amount: number; status: string; paymentMethod: string }> => {
    return fetchApi(`/payments?bookingId=${bookingId}`);
=======
  getByBookingId: async (bookingId: string): Promise<{ id: string; amount: number; status: string; paymentMethod: string }> => {
    return fetchWithAuth(`/payments?bookingId=${bookingId}`);
  },
};

// Reviews API
export const reviewApi = {
  getByMechanicId: async (mechanicId: string): Promise<{ id: string; bookingId: string; userId: string; rating: number; comment: string; createdAt: string }[]> => {
    return fetchApi(`/reviews?mechanicId=${mechanicId}`);
  },

  create: async (reviewData: {
    bookingId: string;
    mechanicId: string;
    rating: number;
    comment: string;
  }): Promise<any> => {
    return fetchWithAuth('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
>>>>>>> jules-1751083910730374172-8e0c37a0
  },
};

// Helper function for authenticated requests
export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  return fetchApi<T>(endpoint, {
    ...options,
    headers: {
<<<<<<< HEAD
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
=======
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
>>>>>>> jules-1751083910730374172-8e0c37a0
    },
  });
}
