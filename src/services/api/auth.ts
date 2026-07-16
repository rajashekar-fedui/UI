/**
 * Authentication API Service
 * 
 * This module encapsulates all authentication-related API calls.
 * 
 * Production Pattern:
 * - Centralized API endpoints prevent duplication
 * - Type-safe request/response handling
 * - Consistent error handling
 * - Easy to maintain and extend
 */

import apiClient from './client';
import {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
  ApiResponse,
} from '@/types';

class AuthService {
  /**
   * Login user with email and password
   * Stores token and refresh token in localStorage
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
    
    const { user, token, refreshToken } = response.data.data!;
    
    // Store tokens
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token, refreshToken, expiresIn: 3600 };
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      '/auth/register',
      data
    );
    
    return response.data.data!;
  }

  /**
   * Request password reset
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ApiResponse<ForgotPasswordResponse>>(
      '/auth/forgot-password',
      data
    );
    
    return response.data.data!;
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      data
    );
    
    return response.data.data!;
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      data
    );
    
    return response.data.data!;
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/verify-email',
      { token }
    );
    
    return response.data.data!;
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/refresh',
      { refreshToken }
    );
    
    const { user, token, refreshToken: newRefreshToken } = response.data.data!;
    
    // Update stored tokens
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', newRefreshToken);
    
    return { user, token, refreshToken: newRefreshToken, expiresIn: 3600 };
  }

  /**
   * Logout user
   * Clears tokens from localStorage and backend
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  }

  /**
   * Social OAuth login
   */
  static async socialLogin(provider: 'google' | 'github', token: string): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      `/auth/social/${provider}`,
      { token }
    );
    
    const { user, token: authToken, refreshToken } = response.data.data!;
    
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token: authToken, refreshToken, expiresIn: 3600 };
  }
}

export default AuthService;
