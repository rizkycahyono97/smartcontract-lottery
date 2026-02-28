'use client';

import { useReadContracts } from 'wagmi';
import { wagmiContractConfig } from '@/src/config/wagmiContractConfig';
import { formatEther } from 'viem';
import {
  Users,
  Trophy,
  Ticket,
  LockOpen,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

export function LotteryEntranceStatus() {
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      { ...wagmiContractConfig, functionName: 'getEntrance' },
      { ...wagmiContractConfig, functionName: 'getNumberOfPlayer' },
      { ...wagmiContractConfig, functionName: 'getRecentWinner' },
      { ...wagmiContractConfig, functionName: 'getRaffleState' },
      { ...wagmiContractConfig, functionName: 'checkUpkeep', args: ['0x'] }
    ]
  });

  const entranceFee = data?.[0]?.result as bigint | undefined;
  const totalPlayers = data?.[1]?.result as bigint | undefined;
  const recentWinner = data?.[2]?.result as string | undefined;
  const raffleState = data?.[3]?.result as number | undefined;
  const upkeepResult = data?.[4]?.result as [boolean, string] | undefined;
  const isUpkeepNeeded = upkeepResult?.[0];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-28 bg-gray-100 rounded-2xl border border-gray-200"
          />
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2">
        <AlertCircle size={18} />
        <span className="text-sm font-medium">
          Gagal memuat data kontrak: {error.message}
        </span>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* UX: System Status Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
          raffleState === 1
            ? 'bg-amber-50 border-amber-200'
            : isUpkeepNeeded
              ? 'bg-blue-50 border-blue-200'
              : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {raffleState === 1 ? (
            <div className="p-2 bg-amber-500 rounded-full animate-spin text-white">
              <Loader2 size={16} />
            </div>
          ) : isUpkeepNeeded ? (
            <div className="p-2 bg-blue-500 rounded-full text-white animate-pulse">
              <Clock size={16} />
            </div>
          ) : (
            <div className="p-2 bg-gray-400 rounded-full text-white">
              <CheckCircle2 size={16} />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              {raffleState === 1
                ? 'Sedang Menghitung Pemenang'
                : isUpkeepNeeded
                  ? 'Menunggu Eksekusi Node'
                  : 'Menunggu Pemain Baru'}
            </h4>
            <p className="text-xs text-gray-500">
              {raffleState === 1
                ? 'Chainlink VRF sedang menghasilkan angka acak aman...'
                : isUpkeepNeeded
                  ? 'Syarat undian terpenuhi. Node Automation akan segera memproses.'
                  : 'Undian akan otomatis dimulai jika syarat waktu dan pemain terpenuhi.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Entrance Fee */}
        <div className="group p-5 border rounded-2xl bg-white shadow-sm border-gray-100 hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Ticket size={20} />
            </div>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
              Entry
            </span>
          </div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Entrance Fee
          </h3>
          <p className="text-2xl font-black text-gray-900">
            {entranceFee ? `${formatEther(entranceFee)} ETH` : '0 ETH'}
          </p>
        </div>

        {/* 2. Raffle State */}
        <div
          className={`p-5 border rounded-2xl shadow-sm transition-all ${
            raffleState === 0
              ? 'bg-white border-gray-100'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-2 rounded-lg ${raffleState === 0 ? 'bg-green-50 text-green-600' : 'bg-amber-100 text-amber-600'}`}
            >
              {raffleState === 0 ? (
                <LockOpen size={20} />
              ) : (
                <Loader2 size={20} className="animate-spin" />
              )}
            </div>
          </div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Current State
          </h3>
          <p
            className={`text-2xl font-black ${raffleState === 0 ? 'text-green-600' : 'text-amber-700'}`}
          >
            {raffleState === 0 ? 'OPEN' : 'BUSY'}
          </p>
        </div>

        {/* 3. Total Players */}
        <div className="p-5 border rounded-2xl bg-white shadow-sm border-gray-100 hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full uppercase">
              Live
            </span>
          </div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Participants
          </h3>
          <p className="text-2xl font-black text-gray-900">
            {totalPlayers?.toString() || '0'}
          </p>
        </div>

        {/* 4. Recent Winner */}
        <div className="p-5 border rounded-2xl bg-white shadow-sm border-gray-100 hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Trophy size={20} />
            </div>
          </div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Last Winner
          </h3>
          <p className="text-sm font-mono font-bold text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-100 mt-2 truncate">
            {recentWinner
              ? `${recentWinner.slice(0, 6)}...${recentWinner.slice(-4)}`
              : 'Waiting...'}
          </p>
        </div>
      </div>
    </div>
  );
}
