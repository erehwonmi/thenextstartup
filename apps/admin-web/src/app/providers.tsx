'use client';
import React from 'react';
import { Toaster, TooltipProvider } from '@ts/uikit';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Providers;
