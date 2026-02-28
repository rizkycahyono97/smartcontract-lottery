'use client';

import { useEffect, useRef } from 'react';
import { useConnection } from 'wagmi';
import { toast } from 'sonner';
import { CircleX, CheckCircle2 } from 'lucide-react';

export function WalletObserver() {
  const { address, isConnected } = useConnection();
  const prevConnected = useRef<boolean>(false);

  useEffect(() => {
    if (isConnected && !prevConnected.current) {
      toast.success('Wallet Connected', {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        duration: 4000,
        style: {
          borderLeft: '4px solid #22c55e',
          background: '#f0fdf4',
          color: '#000000'
        }
      });
    } else if (!isConnected && prevConnected.current) {
      toast.error('Wallet Disconnect', {
        icon: <CircleX className="h-5 w-5 text-red-500" />,
        style: {
          borderLeft: '4px solid #ef4444',
          background: '#fef2f2',
          color: '#000000'
        }
      });
    }

    prevConnected.current = isConnected;
  }, [isConnected, address]);

  return null;
}
