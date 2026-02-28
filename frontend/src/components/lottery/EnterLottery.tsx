'use client';

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract
} from 'wagmi';
import { wagmiContractConfig } from '@/src/config/wagmiContractConfig';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

export function EnterLottery() {
  const { data: entranceFee } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getEntrance'
  });

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const handleEnterRaffle = () => {
    if (!entranceFee) return toast.error('data contract belum siap');

    writeContract(
      {
        ...wagmiContractConfig,
        functionName: 'enterRaffle',
        value: entranceFee as bigint
      },
      {
        onSuccess: () => {
          toast.info('entranceFee berhasil dikirim', {
            description: 'Menunggu konfirmasi blockchain...'
          });
        },
        onError: err => {
          toast.error('entranceFee gagal dikirim', {
            description: err.message.includes('User rejected')
              ? 'kamu membatalkan transaksi di wallet'
              : 'terjadi kesalahan di sistem'
          });
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <Button
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-2xl shadow-lg transition-all"
        disabled={isPending || isConfirming}
        onClick={handleEnterRaffle}
      >
        {isPending || isConfirming ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {isConfirming ? 'Memverifikasi...' : 'Cek Wallet Kamu...'}
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Ikuti Undian Sekarang
          </>
        )}
      </Button>

      {isSuccess && (
        <p className="text-center text-xs text-green-600 font-medium animate-bounce">
          🎉 Kamu berhasil masuk ke arena lottery!
        </p>
      )}
    </div>
  );
}
