'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FullScreenLoading } from '@/components/ui/full-screen-loading';

interface User {
  name: string;
  email: string;
  id?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  isLoggingOut: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const API_ENDPOINTS = {
  ME: '/api/me',
  LOGOUT: '/api/logout',
} as const;

const FETCH_OPTIONS = {
  noCache: { cache: 'no-store' as RequestCache },
  noCacheHeaders: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
  },
} as const;

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.ME, FETCH_OPTIONS.noCache);
        
        if (response.ok) {
          const data = await response.json();
          if (data?.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to check user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Handle user state updates
  const handleSetUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    
    // Reset logout state when user logs in
    if (newUser) {
      setIsLoggingOut(false);
    }
  }, []);

  // Cleanup effect to ensure logout state is reset on unmount
  useEffect(() => {
    return () => {
      setIsLoggingOut(false);
    };
  }, []);

  // Handle logout process
  const logout = useCallback(async () => {
    // Prevent duplicate logout requests
    if (isLoggingOut) return;

    // Immediately set logout state and clear user to prevent dashboard flash
    setIsLoggingOut(true);
    setUser(null);

    try {
      const timestamp = Date.now();
      const response = await fetch(`${API_ENDPOINTS.LOGOUT}?t=${timestamp}`, {
        method: 'POST',
        ...FETCH_OPTIONS.noCache,
        keepalive: true,
        headers: FETCH_OPTIONS.noCacheHeaders,
      });
      
      // Only proceed with navigation if logout was successful
      if (response.ok) {
        // Clear any cached data
        if (typeof window !== 'undefined') {
          // Clear any localStorage/sessionStorage if needed
          localStorage.removeItem('user');
          sessionStorage.clear();
        }
        
        // Add a delay to show the loading animation before navigation
        setTimeout(() => {
          router.replace('/');
          // Reset logout state after navigation
          setTimeout(() => {
            setIsLoggingOut(false);
          }, 100);
        }, 800); // Show loading for 800ms
      } else {
        console.error('Logout failed:', response.statusText);
        // Reset logout state if logout failed
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Reset logout state if logout failed
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, router]);

  const contextValue: UserContextType = {
    user,
    setUser: handleSetUser,
    isLoading,
    isLoggingOut,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
      <FullScreenLoading
        isVisible={isLoggingOut}
        showSteps={false}
        duration={800}
      />
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}