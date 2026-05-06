export type UserRole = 'customer' | 'mechanic' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
<<<<<<< HEAD
  createdAt: string;
  updatedAt?: string;
}

export interface Mechanic extends User {
  role: 'mechanic';
  speciality: string[];
  rating: number;
  totalJobs: number;
  isOnline: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  verified: boolean;
  pricePerHour: number;
=======
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
>>>>>>> jules-1751083910730374172-8e0c37a0
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
<<<<<<< HEAD
  customerId: string;
  mechanicId: string;
=======
  userId: string;
  mechanicId: string;
  serviceId: string;
>>>>>>> jules-1751083910730374172-8e0c37a0
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
<<<<<<< HEAD
  createdAt: string;
  updatedAt: string;
=======
  mechanicLocation?: {
    lat: number;
    lng: number;
  } | null;
  createdAt: string;
  updatedAt?: string;
>>>>>>> jules-1751083910730374172-8e0c37a0
  scheduledAt?: string;
  eta?: string;
  estimatedCost: number;
  finalCost?: number;
<<<<<<< HEAD
  isEmergency: boolean;
=======
  isEmergency?: boolean;
>>>>>>> jules-1751083910730374172-8e0c37a0
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  text: string;
<<<<<<< HEAD
  timestamp: string;
=======
  createdAt: string;
>>>>>>> jules-1751083910730374172-8e0c37a0
}

export interface Review {
  id: string;
  bookingId: string;
<<<<<<< HEAD
  customerId: string;
=======
  userId: string;
>>>>>>> jules-1751083910730374172-8e0c37a0
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
<<<<<<< HEAD
  duration?: number; // in minutes
=======
  duration?: number;
>>>>>>> jules-1751083910730374172-8e0c37a0
  category?: string;
}
