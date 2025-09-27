'use client';

import React from 'react';
import { QueryProvider } from './QueryProvider';
import { UserProvider } from '@/contexts/UserContext';
import { ThemeProvider } from '@/components/theme-provider';
import GlobalToaster from '@/components/common/GlobalToaster';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <UserProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div id="app-root" className="min-h-screen">
            {children}
          </div>
          <GlobalToaster />
        </ThemeProvider>
      </UserProvider>
    </QueryProvider>
  );
}
