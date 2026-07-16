/**
 * Custom Hooks for Authentication
 * 
 * These hooks provide easy access to auth functionality throughout the app
 * 
 * Production Pattern:
 * - Hooks abstract store complexity
 * - Type-safe authentication operations
 * - Consistent error handling
 */

import { useAuthStore } from '@/store/auth';
import { LoginCredentials, RegisterData, User } from '@/types';

/**
 * useAuth Hook
 * Main hook for accessing auth state and methods
 * 
 * Usage:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const authStore = useAuthStore();

  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    setUser: authStore.setUser,
    clearError: authStore.clearError,
  };
}

/**
 * useAuthActions Hook
 * Provides only auth action methods, useful when you only need methods
 */
export function useAuthActions() {
  const { login, register, logout, clearError, setError } = useAuthStore();

  return {
    login,
    register,
    logout,
    clearError,
    setError,
  };
}

/**
 * useIsAuthenticated Hook
 * Simple hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}

/**
 * useCurrentUser Hook
 * Returns current user or null
 */
export function useCurrentUser(): User | null {
  return useAuthStore((state) => state.user);
}

/**
 * useAuthLoading Hook
 * Returns loading state
 */
export function useAuthLoading() {
  return useAuthStore((state) => state.isLoading);
}

/**
 * useAuthError Hook
 * Returns auth error state
 */
export function useAuthError() {
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  return { error, clearError };
}
