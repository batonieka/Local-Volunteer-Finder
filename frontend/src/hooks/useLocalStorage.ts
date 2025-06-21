import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  console.log(`[useLocalStorage] Initializing hook for key: "${key}"`);
  
  // Get from localStorage or return initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      console.log(`[useLocalStorage] Reading from localStorage for key: "${key}"`);
      const item = window.localStorage.getItem(key);
      console.log(`[useLocalStorage] Raw localStorage value for "${key}":`, item);
      
      if (item === null) {
        console.log(`[useLocalStorage] No value found for "${key}", using initial value:`, initialValue);
        return initialValue;
      }
      
      const parsed = JSON.parse(item);
      console.log(`[useLocalStorage] Parsed value for "${key}":`, parsed);
      return parsed;
    } catch (error) {
      console.error(`[useLocalStorage] Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          console.log(`[useLocalStorage] Storage event detected for "${key}":`, newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`[useLocalStorage] Error parsing storage event for "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  // Return a wrapped setter function that saves to state and localStorage
  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      console.log(`[useLocalStorage] Setting value for "${key}"`);
      console.log(`[useLocalStorage] Previous value:`, storedValue);
      console.log(`[useLocalStorage] New value input:`, value);
      
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      console.log(`[useLocalStorage] Value to store:`, valueToStore);
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      const serialized = JSON.stringify(valueToStore);
      console.log(`[useLocalStorage] Serialized value:`, serialized);
      window.localStorage.setItem(key, serialized);
      
      // Verify it was saved
      const verification = window.localStorage.getItem(key);
      console.log(`[useLocalStorage] Verification - value actually saved:`, verification);
      
    } catch (error) {
      console.error(`[useLocalStorage] Error setting localStorage key "${key}":`, error);
    }
  };

  console.log(`[useLocalStorage] Current state for "${key}":`, storedValue);
  return [storedValue, setValue];
}