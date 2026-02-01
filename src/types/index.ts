
export type UserRole = 'customer' | 'mechanic' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Mechanic extends User {
  speciality: string;
  rating: number;
  distance?: string;
  pricePerHour: number;
  isOnline: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

export type BookingStatus = 'pending' | 'accepted' | 'otw' | 'working' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerId: string;
  mechanicId?: string;
  serviceId: string;
  status: BookingStatus;
  vehicleDetails: string;
  location: string;
  scheduledAt: string;
  totalCost?: number;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
