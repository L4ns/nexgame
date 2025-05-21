import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { SWEET_BONANZA_SYMBOLS, SWEET_BONANZA_SYMBOL_COLORS } from '../utils/constants';
import { Candy, RotateCw, Clock, Gift, History } from 'lucide-react';

const SweetBonanzaPage = () => {
  const { address, isConnected, connectWallet } = useWeb3Context();
  const [betAmount, setBetAmount] = useState(0.01);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [freeSpins, setFreeSpins] = useState(0);
  const [grid, setGrid] = useState<number[]>(Array(30).fill(0)); // 6x5 grid
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [tumbles, setTumbles] = useState<number | null>(null);
  const [spinHistory, setSpinHistory] = useState<any[]>([]);

  // Simulate loading free spins from contract
  useEffect(() => {
    if (isConnected) {
      setFreeSpins(0); // In a real app, this would come from the contract
    }
  }, [isConnected]);

  // Predefined bet amounts
  const betOptions = [0.01, 0.05, 0.1, 0.5, 1, 5];

  const handleSpin = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setIsSpinning(true);
    setWinAmount(null);
    setMultiplier(null);
    setTumbles(null);

    // Simulate grid spinning animation
    let counter = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      const newGrid = Array(30).fill(0).map(() => Math.floor(Math.random() * 10));
      setGrid(newGrid);
      counter++;

      if (counter >= maxIterations) {
        clearInterval(interval);
        
        // Simulate spin result
        const win = Math.random() > 0.7;
        const resultGrid = Array(30).fill(0).map(() => Math.floor(Math.random() * 10));
        const resultTumbles = win ? Math.floor(Math.random() * 5) + 1 : 0;
        const resultMultiplier = win ? Math.floor(Math.random() * 100) + 1 : 0;
        const resultWinAmount = win ? betAmount * resultMultiplier : 0;

        setGrid(resultGrid);
        setWinAmount(resultWinAmount);
        setMultiplier(resultMultiplier);
        setTumbles(resultTumbles);
        setIsSpinning(false);

        // Add to history
        setSpinHistory([
          {
            bet: betAmount,
            win,
            payout: resultWinAmount,
            grid: resultGrid,
            tumbles: resultTumbles,
            multiplier: resultMultiplier,
            timestamp: Date.now()
          },
          ...spinHistory.slice(0, 9) // Keep only last 10
        ]);
      }
    }, 100);
  };

  const handleBuyBonus = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    // Simulate buying bonus
    setFreeSpins(prev => prev + 10);
  };

  const renderSymbol = (symbolId: number) => {
    return (
      <div 
        className={`w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-2xl ${SWEET_BONANZA_SYMBOL_COLORS[symbolId] || 'bg-gray-500'}`}
      >
        {SWEET_BONANZA_SYMBOLS[symbolId] || '❓'}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          <Candy className="text-pink-400" size={32} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-500">
            Sweet Bonanza
          </span>
        </h1>
        <p className="text-gray-300">Spin to match sweet symbols and win big!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Game Controls */}
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 mb-6">
            <h2 className="text-xl font-bold mb-4">Game Controls</h2>
            
            {/* Bet Amount */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Bet Amount (ETH)</label>
              <div className="grid grid-cols-3 gap-2">
                {betOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setBetAmount(option)}
                    className={`px-2 py-1 rounded ${
                      betAmount === option
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Free Spins */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Free Spins</span>
                <span className="font-bold text-yellow-400">{freeSpins}</span>
              </div>
              <button
                onClick={handleBuyBonus}
                disabled={isSpinning}
                className="w-full py-2 px-4 rounded bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Gift size={18} />
                Buy Bonus (25x Bet)
              </button>
            </div>
            
            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full py-3 px-4 rounded bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isSpinning ? (
                <>
                  <RotateCw size={20} className="animate-spin" />
                  Spinning...
                </>
              ) : (
                <>
                  <Candy size={20} />
                  SPIN
                </>
              )}
            </button>
          </div>
          
          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full py-2 px-4 rounded bg-slate-700 hover:bg-slate-600 mb-6 flex items-center justify-center gap-2"
          >
            <History size={18} />
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
          
          {/* Win Information */}
          {winAmount !== null && (
            <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${winAmount > 0 ? 'border-green-500/30' : 'border-red-500/30'} mb-6 transition-all animate-fadeIn`}>
              <h3 className="text-xl font-bold mb-2">
                {winAmount > 0 ? 'Big Win!' : 'No Win'}
              </h3>
              
              {winAmount > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Win Amount</span>
                    <span className="font-bold text-green-400">{winAmount.toFixed(4)} ETH</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Multiplier</span>
                    <span className="font-bold text-yellow-400">{multiplier}x</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Tumbles</span>
                    <span className="font-bold text-blue-400">{tumbles}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-300">Better luck next time!</p>
              )}
            </div>
          )}
        </div>
        
        {/* Game Grid */}
        <div className="md:col-span-2 order-1 md:order-2">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="grid grid-cols-6 gap-1">
              {grid.map((symbol, index) => (
                <div 
                  key={index} 
                  className={`transition-all duration-300 ${isSpinning ? 'animate-bounce' : ''}`}
                >
                  {renderSymbol(symbol)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Spin History */}
          {showHistory && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 mt-6">
              <h3 className="text-xl font-bold mb-4">Spin History</h3>
              
              {spinHistory.length === 0 ? (
                <p className="text-gray-400">No spins yet. Start playing to see your history.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {spinHistory.map((spin, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg ${spin.win ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">Bet: {spin.bet} ETH</span>
                        <span className={spin.win ? 'text-green-400' : 'text-red-400'}>
                          {spin.win ? `+${spin.payout.toFixed(4)} ETH` : 'No Win'}
                        </span>
                      </div>
                      
                      {spin.win && (
                        <div className="flex justify-between text-sm">
                          <span>Multiplier: {spin.multiplier}x</span>
                          <span>Tumbles: {spin.tumbles}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(spin.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetBonanzaPage;