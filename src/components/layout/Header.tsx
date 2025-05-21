import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Gamepad2 } from 'lucide-react';
import { useWeb3Context } from '../../contexts/Web3Context';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address, connectWallet, disconnectWallet } = useWeb3Context();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-slate-800/80 backdrop-blur-md py-4 border-b border-purple-500/20">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <Gamepad2 className="text-purple-400" size={32} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            BlockPlay
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/sweet-bonanza" className="text-gray-300 hover:text-white transition-colors">
            Sweet Bonanza
          </Link>
          <Link to="/tap-tap" className="text-gray-300 hover:text-white transition-colors">
            Tap Tap
          </Link>
          
          {address ? (
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-purple-900/50 rounded-lg border border-purple-500/30">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button 
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/30 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-purple-500/20">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/sweet-bonanza" 
              className="text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sweet Bonanza
            </Link>
            <Link 
              to="/tap-tap" 
              className="text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tap Tap
            </Link>
            
            {address ? (
              <div className="flex flex-col gap-3">
                <span className="px-4 py-2 bg-purple-900/50 rounded-lg border border-purple-500/30">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button 
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/30 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;