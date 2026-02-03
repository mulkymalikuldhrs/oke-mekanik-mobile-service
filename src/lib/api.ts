
import { Booking, Mechanic, Message, Review, User } from '@/types';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local Storage Keys
const KEYS = {
  BOOKINGS: 'ok_mekanik_bookings',
  MECHANICS: 'ok_mekanik_mechanics',
  MESSAGES: 'ok_mekanik_messages',
  REVIEWS: 'ok_mekanik_reviews',
  USERS: 'ok_mekanik_all_users',
};

// Initial Data Seed
const seedData = () => {
  if (!localStorage.getItem(KEYS.MECHANICS)) {
    const initialMechanics: Mechanic[] = [
      {
        id: 'mech_1',
        name: 'Ahmad Rizki',
        email: 'ahmad@example.com',
        phone: '08123456789',
        role: 'mechanic',
        speciality: ['Mesin', 'Transmisi'],
        rating: 4.9,
        totalJobs: 245,
        isOnline: true,
        verified: true,
        pricePerHour: 75000,
        createdAt: new Date().toISOString(),
        avatar: '👨‍🔧',
      },
      {
        id: 'mech_2',
        name: 'Budi Santoso',
        email: 'budi@example.com',
        phone: '08123456780',
        role: 'mechanic',
        speciality: ['Kelistrikan', 'AC'],
        rating: 4.8,
        totalJobs: 189,
        isOnline: true,
        verified: true,
        pricePerHour: 80000,
        createdAt: new Date().toISOString(),
        avatar: '🔧',
      },
      {
        id: 'mech_3',
        name: 'Sari Mekanik',
        email: 'sari@example.com',
        phone: '08123456781',
        role: 'mechanic',
        speciality: ['Rem', 'Suspensi'],
        rating: 4.9,
        totalJobs: 167,
        isOnline: false,
        verified: true,
        pricePerHour: 70000,
        createdAt: new Date().toISOString(),
        avatar: '👩‍🔧',
      },
    ];
    localStorage.setItem(KEYS.MECHANICS, JSON.stringify(initialMechanics));
  }
};

seedData();

export const api = {
  // Mechanics
  getMechanics: async (): Promise<Mechanic[]> => {
    await delay(500);
    return JSON.parse(localStorage.getItem(KEYS.MECHANICS) || '[]');
  },

  getMechanicById: async (id: string): Promise<Mechanic | undefined> => {
    const mechanics = await api.getMechanics();
    return mechanics.find(m => m.id === id);
  },

  updateMechanicStatus: async (id: string, isOnline: boolean): Promise<void> => {
    const mechanics = await api.getMechanics();
    const index = mechanics.findIndex(m => m.id === id);
    if (index !== -1) {
      mechanics[index].isOnline = isOnline;
      localStorage.setItem(KEYS.MECHANICS, JSON.stringify(mechanics));
    }
  },

  // Bookings
  getBookings: async (): Promise<Booking[]> => {
    await delay(500);
    return JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
  },

  getBookingById: async (id: string): Promise<Booking | undefined> => {
    const bookings = await api.getBookings();
    return bookings.find(b => b.id === id);
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
    await delay(800);
    const bookings = await api.getBookings();
    const newBooking: Booking = {
      ...bookingData,
      id: `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    return newBooking;
  },

  updateBookingStatus: async (id: string, status: Booking['status']): Promise<void> => {
    const bookings = await api.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index].status = status;
      bookings[index].updatedAt = new Date().toISOString();
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    }
  },

  // Messages
  getMessagesByBookingId: async (bookingId: string): Promise<Message[]> => {
    const allMessages: Message[] = JSON.parse(localStorage.getItem(KEYS.MESSAGES) || '[]');
    return allMessages.filter(m => m.bookingId === bookingId);
  },

  sendMessage: async (messageData: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    const allMessages: Message[] = JSON.parse(localStorage.getItem(KEYS.MESSAGES) || '[]');
    const newMessage: Message = {
      ...messageData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    allMessages.push(newMessage);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(allMessages));
    return newMessage;
  },
};
