export const Footer = () => {
  return (
    <footer className="border-t bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-gray-900 font-bold text-lg">
          CH4RL0TT3<span className="text-blue-600">.</span>
        </div>

        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Built with Next.js, Wagmi & Solidity.
        </p>

        <div className="flex gap-6 text-gray-400">
          <a href="#" className="hover:text-gray-600 transition-colors text-xs">
            Github
          </a>
          <a href="#" className="hover:text-gray-600 transition-colors text-xs">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};
