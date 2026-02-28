import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tighter shrink-0"
          >
            SMART LOTTERY<span className="text-blue-600">.</span>
          </Link>

          <div className="hidden md:flex gap-10 text-sm font-semibold text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Hardhat
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Wagmi
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Nextjs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
