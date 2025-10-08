import { useState, useEffect, useCallback, useRef } from 'react';
import { OnboardingData } from '../types';

const APP_DATA_KEY = 'brightRankData';
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export interface UseAuthReturn {
  appData: OnboardingData | null;
  setAppData: (data: OnboardingData) => void;
  logout: (message?: string, type?: 'success' | 'error') => void;
  isAuthenticated: boolean;
}

export const useAuth = (
  onLogout?: (message: string, type: 'success' | 'error') => void
): UseAuthReturn => {
  const [appData, setAppDataState] = useState<OnboardingData | null>(null);
  const timeoutId = useRef<number | null>(null);

  const logout = useCallback(
    (
      message: string = 'You have been logged out.',
      type: 'success' | 'error' = 'success'
    ) => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
      setAppDataState(null);
      localStorage.removeItem(APP_DATA_KEY);
      if (onLogout) {
        onLogout(message, type);
      }
    },
    [onLogout]
  );

  const setAppData = useCallback((data: OnboardingData) => {
    setAppDataState(data);
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
  }, []);

  // Session timeout management
  useEffect(() => {
    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ];

    const resetTimeout = () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      timeoutId.current = window.setTimeout(() => {
        logout('Your session has expired due to inactivity.', 'error');
      }, SESSION_TIMEOUT);
    };

    if (appData) {
      resetTimeout();
      events.forEach(event => window.addEventListener(event, resetTimeout));
    }

    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, [appData, logout]);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(APP_DATA_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (!parsedData.competitors) {
          parsedData.competitors = [];
        }
        setAppDataState(parsedData);
      }
    } catch (error) {
      console.error('Failed to parse app data from localStorage', error);
      localStorage.removeItem(APP_DATA_KEY);
    }
  }, []);

  return {
    appData,
    setAppData,
    logout,
    isAuthenticated: !!appData,
  };
};
