
<<<<<<< HEAD
export type UserRole = 'customer' | 'mechanic' | 'admin';
=======
export type UserRole = 'customer' | 'mechanic';
>>>>>>> origin/jules-9588893365322302084-daabd2d3

export interface User {
  id: string;
  name: string;
  email: string;
<<<<<<< HEAD
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Mechanic extends User {
  speciality: string;
  rating: number;
  distance?: string;
  pricePerHour: number;
=======
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Mechanic extends User {
  role: 'mechanic';
  speciality: string[];
  rating: number;
  totalJobs: number;
>>>>>>> origin/jules-9588893365322302084-daabd2d3
  isOnline: boolean;
  location?: {
    lat: number;
    lng: number;
<<<<<<< HEAD
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

export type BookingStatus = 'pending' | 'accepted' | 'otw' | 'working' | 'completed' | 'cancelled';
=======
    address: string;
  };
  verified: boolean;
  pricePerHour: number;
}

export type BookingStatus = 'pending' | 'accepted' | 'otw' | 'arrived' | 'working' | 'completed' | 'cancelled';
>>>>>>> origin/jules-9588893365322302084-daabd2d3

export interface Booking {
  id: string;
  customerId: string;
<<<<<<< HEAD
  mechanicId?: string;
  serviceId: string;
  status: BookingStatus;
  vehicleDetails: string;
  location: string;
  scheduledAt: string;
  totalCost?: number;
  createdAt: string;
=======
  mechanicId: string;
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
  createdAt: string;
  updatedAt: string;
  eta?: string;
  estimatedCost: number;
  finalCost?: number;
  isEmergency: boolean;
>>>>>>> origin/jules-9588893365322302084-daabd2d3
}

export interface Message {
  id: string;
<<<<<<< HEAD
  senderId: string;
  receiverId: string;
  content: string;
=======
  bookingId: string;
  senderId: string;
  text: string;
>>>>>>> origin/jules-9588893365322302084-daabd2d3
  timestamp: string;
}

export interface Review {
  id: string;
  bookingId: string;
<<<<<<< HEAD
=======
  customerId: string;
  mechanicId: string;
>>>>>>> origin/jules-9588893365322302084-daabd2d3
  rating: number;
  comment: string;
  createdAt: string;
}
