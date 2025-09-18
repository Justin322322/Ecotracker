'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each component tree
  // This ensures we don't share state between different components
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          // Retry failed requests
          retry: (failureCount, error: unknown) => {
            // Don't retry for 4xx errors
            const errorStatus = (error as { status?: number })?.status;
            if (errorStatus && errorStatus >= 400 && errorStatus < 500) {
              return false;
            }
            return failureCount < 3;
          },
          // Don't refetch on window focus by default
          refetchOnWindowFocus: false,
          // Refetch on reconnect
          refetchOnReconnect: true,
        },
        mutations: {
          // Retry mutations once
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
