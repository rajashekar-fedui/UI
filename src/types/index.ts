/**
 * Core Type Definitions for the Application
 * This file contains all the fundamental types used across the application
 */

// ============================================================================
// AUTH TYPES
// ============================================================================

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  emailDigest: 'daily' | 'weekly' | 'never';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponse {
  user: User;
  verificationRequired: boolean;
  verificationEmail?: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetTokenSent: boolean;
}

// ============================================================================
// DASHBOARD & DATA TYPES
// ============================================================================

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Dashboard {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  revenue: number;
  growth: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  errors: FormError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  role?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TableState {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters: FilterOptions;
}

// ============================================================================
// COMMON TYPES
// ============================================================================

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
