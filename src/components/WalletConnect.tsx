import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { Wallet, ChevronUp } from 'lucide-react';

const WalletConnect = () => {
  const { address, isConnected, connectWallet } = useWeb3Context();
  const [isVisible, setIsVisible] = useState(false);

  // Hide wallet modal when connected
  useEffect(() => {
    if (isConnected) {
      setIsVisible(false);
    }
  }, [isConnected]);

  if (isConnected) return null;

  return (
    <>
      {/* Mobile floating button */}
      <div className="fixed bottom-5 right-5 z-50 md:hidden">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-4 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        >
          <Wallet size={24} />
        </button>
      </div>

      {/* Wallet connection panel */}
      <div
        className={`fixed bottom-0 left-0 w-full transform ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        } transition-transform duration-300 ease-in-out md:hidden z-40`}
      >
        <div className="bg-slate-800 border-t border-purple-500/20 rounded-t-xl p-6 shadow-xl">
          <div className="flex justify-center mb-2">
            <button onClick={() => setIsVisible(false)} className="text-gray-400">
              <ChevronUp size={24} />
            </button>
          </div>
          
          <h3 className="text-xl font-bold mb-4 text-center">Connect Your Wallet</h3>
          
          <p className="text-gray-300 mb-6 text-center">
            Connect your wallet to play games and earn rewards
          </p>
          
          <button
            onClick={connectWallet}
            className="w-full py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Wallet size={20} />
            Connect Wallet
          </button>
        </div>
      </div>
    </>
  );
};

export default WalletConnect;