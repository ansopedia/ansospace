"use client";

import { useEffect, useState } from "react";

type SetValue<V> = (value: V | ((prev: V) => V)) => void;

/**
 * Custom hook for managing sessionStorage with React state.
 * Automatically syncs value to sessionStorage and handles SSR safely.
 */
export const useSessionStorage = <K extends string, V>(key: K, initialValue: V): [V, SetValue<V>] => {
  const readValue = (): V => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as V) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<V>(readValue);

  const setValue: SetValue<V> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // Silently fail - storage errors are non-critical
    }
  };

  // Keep state in sync when key or storage changes (important for multi-tab use)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [initialValue, key]);

  return [storedValue, setValue];
};
