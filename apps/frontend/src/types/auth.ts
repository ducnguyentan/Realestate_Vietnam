export type UserType = 'partner' | 'buyer';

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string;
  userType: UserType;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email?: string;
  phone?: string;
  password: string;
  fullName: string;
  userType: UserType;
  avatar?: string;
}

export interface LoginData {
  identifier: string; // email or phone
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface AuthError {
  message: string;
  statusCode: number;
  error?: string;
}
