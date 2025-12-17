import { UserRole } from '../constants/roles';

export interface User {
  id: string;
  email?: string;
  phone: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  phone: string;
  otp: string;
}

export interface RegisterRequest {
  phone: string;
  fullName: string;
  email?: string;
  role: UserRole;
}
