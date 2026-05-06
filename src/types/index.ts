export type UserRole = 'customer' | 'mechanic' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Mechanic {
  id: string;
  user_id?: string;
  name: string;
  speciality: string[];
  rating: number;
  pricePerHour: number;
  isOnline: boolean;
  lat: number;
  lng: number;
  avatar?: string;
  phone?: string;
  years_of_experience?: number;
  bio?: string;
}

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'otw'
  | 'arrived'
  | 'working'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  mechanicId: string;
  serviceId: string;
  status: BookingStatus;
  vehicle: {
    brand: string;
    model: string;
    year: string;
    licensePlate: string;
  };
  problem: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  mechanicLocation?: {
    lat: number;
    lng: number;
  } | null;
  createdAt: string;
  updatedAt?: string;
  scheduledAt?: string;
  eta?: string;
  estimatedCost: number;
  finalCost?: number;
  isEmergency?: boolean;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  mechanicId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration?: number;
  category?: string;
}
