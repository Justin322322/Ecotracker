'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  setIsLoggingOut: (isLoggingOut: boolean) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for existing user data from session cookie
    const checkUser = async () => {
      try {
        const response = await fetch('/api/me', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          if (data?.user) {
            setIsLoggingOut(false);
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    // User state is now managed by session cookies, no localStorage needed
    if (newUser) {
      setIsLoggingOut(false);
    }
  };

  const handleSetLoggingOut = (loggingOut: boolean) => {
    setIsLoggingOut(loggingOut);
    if (loggingOut) {
      setUser(null);
    }
  };

  const logout = async () => {
    if (isLoggingOut) return;
    handleSetLoggingOut(true);
    try {
      await fetch(`/api/logout?t=${Date.now()}`, {
        method: 'POST',
        cache: 'no-store',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout error:', error);
    } finally {
      router.replace('/');
    }
  };

  // Removed logout overlay effects

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, isLoading, isLoggingOut, setIsLoggingOut: handleSetLoggingOut, logout }}>
      {children}
      <FullScreenLoading
        isVisible={isLoggingOut}
        variant="logout"
        onComplete={() => setIsLoggingOut(false)}
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
