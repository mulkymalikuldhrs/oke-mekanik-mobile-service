export type UserRole = 'customer' | 'mechanic' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Mechanic extends User {
  role: 'mechanic';
  speciality: string[];
  rating: number;
  totalJobs?: number;
  isOnline: boolean;
  lat?: number;
  lng?: number;
  verified?: boolean;
  pricePerHour: number;
  avatar?: string;
  yearsOfExperience?: number;
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
  serviceId?: string;
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
  timestamp: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
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
  duration?: number; // in minutes
  category?: string;
}
