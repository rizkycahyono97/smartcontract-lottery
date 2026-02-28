import { raffleAbi } from '@/constants';

export const wagmiContractConfig = {
  address: process.env.NEXT_PUBLIC_RAFFLE_ADDRESS as `0x${string}`,
  abi: raffleAbi.abi
} as const;
