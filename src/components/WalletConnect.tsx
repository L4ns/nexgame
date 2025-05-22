import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { Wallet, ChevronUp } from 'lucide-react';
const WalletConnect = () => {
  // Retrieve connection state and wallet connection function from Web3 context.
  // Removed unused "address" from the context.
  const { isConnected, connectWallet } = useWeb3Context();
  // State to manage the visibility of the wallet modal (for mobile view).
  const [isVisible, setIsVisible] = useState(false);
  // When the user connects, automatically hide the wallet connection panel.
  useEffect(() => {
    if (isConnected) {
      setIsVisible(false);
    }
  }, [isConnected]);
  // If wallet is already connected, do not render the connect button or modal.
  if (isConnected) return null;
  return (
    <>
      {/* Mobile Floating Button */}
      <div className="fixed bottom-5 right-5 z-50 md:hidden">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-4 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        >
          <Wallet size={24} />
        </button>
      </div>
      
      {/* Wallet Connection Panel (appears as a sliding modal from the bottom) */}
      <div
        className={`fixed bottom-0 left-0 w-full transform ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        } transition-transform duration-300 ease-in-out md:hidden z-40`}
      >
        <div className="bg-slate-800 border-t border-purple-500/20 rounded-t-xl p-6 shadow-xl">
          {/* Button to close the modal */}
          <div className="flex justify-center mb-2">
            <button onClick={() => setIsVisible(false)} className="text-gray-400">
              <ChevronUp size={24} />
            </button>
          </div>
          {/* Modal Title */}
          <h3 className="text-xl font-bold mb-4 text-center">Connect Your Wallet</h3>
          {/* Modal Description */}
          <p className="text-gray-300 mb-6 text-center">
            Connect your wallet to play games and earn rewards
          </p>
          {/* Button to trigger the wallet connection */}
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