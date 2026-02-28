'use client';

import { useConnection } from 'wagmi';
import { WalletOptions } from './WalletOptions';
import { Connection } from './Connection';

export default function ConnectWallet() {
  const { isConnected } = useConnection();
  if (isConnected) return <Connection />;
  return <WalletOptions />;
}
