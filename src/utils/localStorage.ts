/**
 * LocalStorage Helper Utilities
 * 
 * Production Pattern:
 * - Type-safe localStorage operations
 * - Error handling for quota exceeded
 * - Automatic serialization/deserialization
 * - Expiration support
 */

interface StorageItem<T> {
  value: T;
  expiresAt?: number;
}

/**
 * Set item in localStorage
 */
export function setStorageItem<T>(key: string, value: T, expirationMinutes?: number): void {
  try {
    const item: StorageItem<T> = {
      value,
      expiresAt: expirationMinutes ? Date.now() + expirationMinutes * 60 * 1000 : undefined,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      console.error('LocalStorage quota exceeded');
    } else {
      console.error('Error setting localStorage item:', error);
    }
  }
}

/**
 * Get item from localStorage
 */
export function getStorageItem<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue ?? null;

    const parsed = JSON.parse(item) as StorageItem<T>;
    
    // Check expiration
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      removeStorageItem(key);
      return defaultValue ?? null;
    }

    return parsed.value;
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return defaultValue ?? null;
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage item:', error);
  }
}

/**
 * Clear all localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Check if key exists in localStorage
 */
export function hasStorageItem(key: string): boolean {
  return localStorage.getItem(key) !== null;
}
