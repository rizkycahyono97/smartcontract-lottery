'use client';

import ConnectWallet from '@/src/components/wallet/ConnectWallet';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <main className="relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 sm:pt-32">
        <div className="text-center">
          {/* Badge Status */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8 transition-all hover:bg-blue-100/50 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
              Sepolia Testnet Network
            </span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-6">
            Simple Project <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Ethereum Lottery
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed mb-12">
            Selamat datang di simple project lottery yang sepenuhnya berjalan di
            atas
            <span className="font-semibold text-gray-900">
              {' '}
              Smart Contract Ethereum
            </span>
            . Tanpa perantara, tanpa admin manual, semua logika permainan
            dikunci secara on-chain menggunakan{' '}
            <span className="font-semibold text-gray-900">
              {' '}
              Chainlink VRF
            </span>{' '}
            untuk menjamin transparansi mutlak bagi setiap partisipan.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16 text-left">
            {/* Left Side: Game Steps */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">Cara Bermain</h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Globe,
                    title: 'Connect',
                    desc: 'Hubungkan wallet MetaMask kamu ke jaringan Sepolia.'
                  },
                  {
                    icon: Zap,
                    title: 'Deposit',
                    desc: 'Bayar Entrance Fee untuk masuk ke dalam antrean pemain.'
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Fair Pick',
                    desc: 'Chainlink VRF akan memilih pemenang secara acak dan otomatis.'
                  }
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-blue-50"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <step.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {idx + 1}. {step.title}
                      </h4>
                      <p className="text-sm text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Action Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Akses Arena
                  </h2>
                  <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <ConnectWallet />
                  </div>

                  <div className="pt-6 border-t border-gray-100 text-center">
                    {isConnected ? (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="text-sm text-green-600 font-semibold flex items-center justify-center gap-2 mb-4">
                          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                          Wallet Connected
                        </p>
                        <Link
                          href="/lottery"
                          className="group flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl"
                        >
                          Masuk Arena
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </Link>
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        <p className="text-xs mb-4">
                          Hubungkan dompet untuk melanjutkan
                        </p>
                        <button
                          disabled
                          className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed"
                        >
                          Akses Terkunci
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Blur Decor */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-400 to-purple-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
    </main>
  );
}
