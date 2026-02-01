
import { User, Mechanic, Booking, Service, Message, Review } from '@/types';

// Simple mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Mechanics
  getMechanics: async (): Promise<Mechanic[]> => {
    await delay(500);
    const res = await fetch('/db.json');
    const data = await res.json();
    return data.mechanics;
  },

  // Bookings
  createBooking: async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
    await delay(800);
    const newBooking: Booking = {
      ...bookingData,
      id: `BK-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    // In a real app, we would POST to the server here
    return newBooking;
  },

  getBookings: async (userId: string, role: 'customer' | 'mechanic'): Promise<Booking[]> => {
    await delay(500);
    const res = await fetch('/db.json');
    const data = await res.json();
    return data.bookings.filter((b: Booking) =>
      role === 'customer' ? b.customerId === userId : b.mechanicId === userId
    );
  },

  updateJobStatus: async (bookingId: string, status: Booking['status']): Promise<void> => {
    await delay(500);
    // Persist status update logic here
  },

  // Messages
  getMessages: async (chatId: string): Promise<Message[]> => {
    await delay(300);
    const res = await fetch('/db.json');
    const data = await res.json();
    return data.messages || [];
  },

  sendMessage: async (message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    await delay(200);
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    return newMessage;
  }
};
