import type { RegisterData, LoginData, AuthResponse, User } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export class AuthService {
  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Đăng ký thất bại');
    }

    const result: AuthResponse = await response.json();

    // Store tokens
    this.setTokens(result.accessToken, result.refreshToken);

    return result;
  }

  /**
   * Login user
   */
  static async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Đăng nhập thất bại');
    }

    const result: AuthResponse = await response.json();

    // Store tokens
    this.setTokens(result.accessToken, result.refreshToken);

    return result;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    const token = this.getAccessToken();

    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear tokens
    this.clearTokens();
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User> {
    const token = this.getAccessToken();

    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        try {
          await this.refreshToken();
          // Retry with new token
          return this.getCurrentUser();
        } catch {
          this.clearTokens();
          throw new Error('Phiên đăng nhập đã hết hạn');
        }
      }

      const error = await response.json();
      throw new Error(error.message || 'Không thể lấy thông tin người dùng');
    }

    return response.json();
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('Không tìm thấy refresh token');
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Không thể làm mới token');
    }

    const result = await response.json();

    // Update access token
    this.setAccessToken(result.accessToken);

    return result;
  }

  /**
   * Store tokens
   */
  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Set access token only
   */
  static setAccessToken(accessToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, accessToken);
    }
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Clear tokens
   */
  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
