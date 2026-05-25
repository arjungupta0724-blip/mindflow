import { useState, useEffect } from 'react';

/**
 * Custom hook to manage persistent state in localStorage with clean state hydration.
 * Allows seamless persistence for task list, XP points, plant levels, and active settings.
 * 
 * @param {string} key - LocalStorage key
 * @param {*} initialValue - Default fallback value
 * @returns {[*, Function]} - State value and setter function
 */
export function useLocalStorage(key, initialValue) {
  // Read state from localStorage on initialization
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep state updated in localStorage when changed
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
