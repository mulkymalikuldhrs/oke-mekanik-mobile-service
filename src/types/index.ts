export type UserRole = 'customer' | 'mechanic' | 'workshop' | 'admin';

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
  workshop_id?: string;
  name: string;
  speciality: string[];
  rating: number;
  pricePerHour: number;
  isOnline: boolean;
  lat: number;
  lng: number;
  avatar?: string;
  phone?: string;
  yearsOfExperience?: number;
  bio?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  isWorkshop?: boolean;
  distance?: number;
  etaMinutes?: number;
}

export interface Workshop {
  id: string;
  user_id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  speciality?: string[];
  rating: number;
  isOnline: boolean;
  operatingHours?: string;
  description?: string;
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
  mechanic?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    speciality: string[];
    avatar?: string;
    pricePerHour: number;
  } | null;
  service?: {
    id: string;
    name: string;
    basePrice: number;
    category: string;
    icon: string;
  } | null;
  customer?: {
    id: string;
    name: string;
    phone: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
  estimatedCost: number;
  finalCost?: number;
  isEmergency?: boolean;
  etaMinutes?: number;
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
  category: string;
  icon: string;
  estimatedDuration: number;
  isEmergencyAvailable: boolean;
}
