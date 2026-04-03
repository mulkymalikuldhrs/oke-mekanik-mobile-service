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
  speciality: string;
  rating: number;
  totalJobs: number;
  isOnline: boolean;
  lat?: number;
  lng?: number;
  location_address?: string;
  verified: boolean;
  pricePerHour: number;
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
  serviceId: string;
  status: BookingStatus;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleLicensePlate: string;
  problem: string;
  locationLat: number;
  locationLng: number;
  locationAddress: string;
  createdAt: string;
  estimatedCost: number;
  finalCost?: number;
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
}
