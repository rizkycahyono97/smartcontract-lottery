'use client';

// wagmi
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../config/wagmiConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
