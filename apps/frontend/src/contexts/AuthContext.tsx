'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '@/services/auth.service';
import type { User, RegisterData, LoginData } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      console.log('[AuthContext] Loading user...');
      try {
        if (AuthService.isAuthenticated()) {
          console.log('[AuthContext] Token found, fetching user...');
          const currentUser = await AuthService.getCurrentUser();
          console.log('[AuthContext] User loaded:', currentUser);
          setUser(currentUser);
        } else {
          console.log('[AuthContext] No token found');
        }
      } catch (error) {
        console.error('[AuthContext] Failed to load user:', error);
        AuthService.clearTokens();
      } finally {
        console.log('[AuthContext] Loading complete');
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: LoginData): Promise<User> => {
    setLoading(true);
    try {
      console.log('[AuthContext] Logging in...');
      const response = await AuthService.login(data);
      console.log('[AuthContext] Login response:', response);
      console.log('[AuthContext] Response.user:', response.user);
      console.log('[AuthContext] Response keys:', Object.keys(response));

      if (!response.user) {
        console.error('[AuthContext] ERROR: response.user is undefined!');
        throw new Error('Server không trả về thông tin người dùng');
      }

      setUser(response.user);
      setLoading(false);
      return response.user;
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    setLoading(true);
    try {
      const response = await AuthService.register(data);
      setUser(response.user);
      setLoading(false);
      return response.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
