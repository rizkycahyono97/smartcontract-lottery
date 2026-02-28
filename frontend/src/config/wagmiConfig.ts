import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import 'dotenv/config';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '';
export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  transports: {
    [sepolia.id]: http()
  }
});
