/**
 * Axios Instance Configuration
 * 
 * This file sets up the HTTP client with:
 * - Request/Response interceptors for auth token handling
 * - Error handling with proper typing
 * - Request retry logic with exponential backoff
 * - Request cancellation for memory leak prevention
 * - Timeout handling
 * 
 * Production Pattern: Centralized API client prevents code duplication
 * and ensures consistent error handling across all API calls.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '@/types';

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
  retryDelay?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 30000; // 30 seconds

// ============================================================================
// CREATE AXIOS INSTANCE
// ============================================================================

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * Request Interceptor
 * 
 * Purpose:
 * - Add authentication token from localStorage to every request
 * - Add request metadata (timestamps, request IDs)
 * - Log requests in development
 * 
 * Pattern: This ensures that all authenticated endpoints automatically
 * include the JWT token without repetition in every API call.
 */

apiClient.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Add token to Authorization header if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();

    // Add timestamp
    config.headers['X-Request-Time'] = new Date().toISOString();

    // Initialize retry count
    if (!config.retryCount) {
      config.retryCount = 0;
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

/**
 * Response Interceptor
 * 
 * Purpose:
 * - Handle successful responses with proper typing
 * - Handle errors with retry logic
 * - Handle token expiration and refresh
 * - Log responses in development
 * 
 * Pattern: Centralized error handling prevents error handling code
 * duplication across the application.
 */

apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const config = error.config as CustomAxiosRequestConfig;

    // Don't retry if no config
    if (!config) {
      return Promise.reject(error);
    }

    // ========================================================================
    // TOKEN EXPIRATION HANDLING
    // ========================================================================
    
    // If 401 Unauthorized and we have a refresh token, try to refresh
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken && !config.url?.includes('/auth/refresh')) {
        try {
          // Attempt to refresh the token
          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          const { token, refreshToken: newRefreshToken } = refreshResponse.data.data;
          
          // Update tokens in localStorage
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          config.headers.Authorization = `Bearer ${token}`;
          return apiClient(config);
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect to login
          clearAuth();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    // ========================================================================
    // RETRY LOGIC WITH EXPONENTIAL BACKOFF
    // ========================================================================

    // Retry on 5xx errors and network timeouts (but not 5xx auth errors)
    const shouldRetry =
      (error.response?.status && error.response.status >= 500) ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ETIMEDOUT';

    if (shouldRetry && config.retryCount! < MAX_RETRIES) {
      config.retryCount = (config.retryCount || 0) + 1;
      
      // Calculate exponential backoff delay
      const delay = RETRY_DELAY * Math.pow(2, config.retryCount - 1);
      
      if (import.meta.env.DEV) {
        console.log(`[API Retry] Attempt ${config.retryCount}/${MAX_RETRIES} after ${delay}ms`);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      return apiClient(config);
    }

    // ========================================================================
    // ERROR LOGGING & FORMATTING
    // ========================================================================

    // Log error details
    console.error('[API Error]', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique request ID for tracking
 * Useful for debugging and monitoring
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clear authentication data
 * Called when token refresh fails or on logout
 */
function clearAuth(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

export default apiClient;
