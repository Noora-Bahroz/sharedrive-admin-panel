export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'user' | 'driver';
  status: 'active' | 'suspended';
  createdAt: unknown;
}

export interface Driver {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'driver';
  createdAt: unknown;
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  userId: string;
  passengerName: string;
  origin: string;
  destination: string;
  distance: string;
  fare: number;
  baseFare: number;
  timeFare: number;
  rideName: string;
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: unknown;
}

export interface RideRequest {
  id: string;
  userId: string;
  passengerName: string;
  driverId: string;
  origin: string;
  destination: string;
  distance: string;
  fare: number;
  baseFare: number;
  timeFare: number;
  rideName: string;
  status: 'pending' | 'accepted' | 'cancelled';
  createdAt: unknown;
}

export interface AdminProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  grantedAt: unknown;
  grantedBy: string;
}
