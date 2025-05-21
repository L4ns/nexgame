import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { Hand, Trophy, Clock, Users, Award, Plus } from 'lucide-react';

const TapTapPage = () => {
  const { address, isConnected, connectWallet } = useWeb3Context();
  const [activeRound, setActiveRound] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [prizePool, setPrizePool] = useState<number | null>(null);
  const [tapCount, setTapCount] = useState<number>(0);
  const [players, setPlayers] = useState<string[]>([]);
  const [playerTaps, setPlayerTaps] = useState<{[address: string]: number}>({});
  const [topPlayer, setTopPlayer] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(5); // Default to 5 minutes
  const [showCreateRound, setShowCreateRound] = useState<boolean>(false);

  // Simulate fetching current round data
  useEffect(() => {
    if (isConnected) {
      // In a real app, these values would come from the contract
      setActiveRound(1);
      setTimeLeft(300); // 5 minutes in seconds
      setPrizePool(0.5); // 0.5 ETH
      setTapCount(0);
    }
  }, [isConnected]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft]);

  // Simulate player data with fake addresses
  useEffect(() => {
    if (isConnected && activeRound) {
      const fakePlayers = [
        '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        address || '0x33fE2E99F4d0B9f7CCf984bFB9089ab3BfC795A4',
      ];
      
      setPlayers(fakePlayers);
      
      const fakePlayerTaps = {
        [fakePlayers[0]]: 42,
        [fakePlayers[1]]: 31,
        [address || fakePlayers[2]]: tapCount,
      };
      
      setPlayerTaps(fakePlayerTaps);
      
      // Determine top player
      const topAddress = Object.entries(fakePlayerTaps)
        .sort(([, a], [, b]) => b - a)[0][0];
      
      setTopPlayer(topAddress);
    }
  }, [isConnected, activeRound, address, tapCount]);

  const handleTap = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    if (!activeRound || timeLeft === null || timeLeft <= 0) {
      return;
    }

    setTapCount(prev => prev + 1);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startNewRound = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    // In a real app, this would call the contract
    setActiveRound(activeRound ? activeRound + 1 : 1);
    setTimeLeft(duration * 60);
    setPrizePool(0.5);
    setTapCount(0);
    setShowCreateRound(false);
  };

  const claimReward = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    // In a real app, this would call the contract
    alert('Reward claimed!');
  };

  const isWinner = address && topPlayer === address && timeLeft === 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          <Hand className="text-orange-400" size={32} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
            Tap Tap
          </span>
        </h1>
        <p className="text-gray-300">Tap as fast as you can to win the prize pool!</p>
      </div>

      {/* Game Status */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 flex flex-col items-center">
          <Clock size={32} className="text-yellow-400 mb-2" />
          <h3 className="text-lg font-semibold mb-1">Time Left</h3>
          {timeLeft !== null ? (
            <span className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          ) : (
            <span className="text-2xl font-bold text-gray-400">--:--</span>
          )}
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 flex flex-col items-center">
          <Trophy size={32} className="text-yellow-400 mb-2" />
          <h3 className="text-lg font-semibold mb-1">Prize Pool</h3>
          {prizePool !== null ? (
            <span className="text-2xl font-bold text-white">{prizePool} ETH</span>
          ) : (
            <span className="text-2xl font-bold text-gray-400">--</span>
          )}
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 flex flex-col items-center">
          <Users size={32} className="text-yellow-400 mb-2" />
          <h3 className="text-lg font-semibold mb-1">Players</h3>
          <span className="text-2xl font-bold text-white">{players.length}</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="order-2 md:order-1">
          {/* Tap Button */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 mb-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Tap to Win!</h2>
            
            <div className="text-center mb-6">
              <p className="text-gray-300 mb-2">Your Taps</p>
              <span className="text-4xl font-bold text-white">{tapCount}</span>
            </div>
            
            <button
              onClick={handleTap}
              disabled={!activeRound || timeLeft === null || timeLeft <= 0}
              className={`w-48 h-48 rounded-full flex items-center justify-center text-4xl font-bold 
                ${!activeRound || timeLeft === null || timeLeft <= 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 active:scale-95'
                } transition-all duration-100`}
            >
              <Hand size={64} />
            </button>
            
            <p className="mt-4 text-sm text-gray-400">
              {!activeRound || timeLeft === null
                ? 'No active round. Start a new one!'
                : timeLeft <= 0
                ? 'Round ended!'
                : 'Tap as fast as you can!'}
            </p>
          </div>
          
          {/* Round Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            {isWinner && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-500/30 rounded-lg text-center">
                <Award size={32} className="text-yellow-400 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-400 mb-1">You Won!</h3>
                <p className="text-gray-300 mb-3">Congratulations! You had the most taps.</p>
                <button
                  onClick={claimReward}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Claim {prizePool} ETH
                </button>
              </div>
            )}

            {showCreateRound ? (
              <div>
                <h3 className="text-xl font-bold mb-4">Start New Round</h3>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={startNewRound}
                    className="flex-1 py-2 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                  >
                    Start Round
                  </button>
                  <button
                    onClick={() => setShowCreateRound(false)}
                    className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateRound(true)}
                className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Start New Round
              </button>
            )}
          </div>
        </div>
        
        {/* Leaderboard */}
        <div className="order-1 md:order-2">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            
            {players.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No players yet. Be the first to join!</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(playerTaps)
                  .sort(([, a], [, b]) => b - a)
                  .map(([playerAddress, taps], index) => {
                    const isYou = playerAddress === address;
                    const isTopPlayer = playerAddress === topPlayer;
                    
                    return (
                      <div 
                        key={playerAddress}
                        className={`p-4 rounded-lg flex items-center justify-between ${
                          isYou 
                            ? 'bg-purple-900/30 border border-purple-500/30' 
                            : isTopPlayer && timeLeft === 0
                            ? 'bg-green-900/30 border border-green-500/30'
                            : 'bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">
                              {isYou 
                                ? 'You' 
                                : `${playerAddress.slice(0, 6)}...${playerAddress.slice(-4)}`}
                            </div>
                            {isTopPlayer && (
                              <div className="text-xs text-yellow-400 flex items-center gap-1">
                                <Trophy size={12} /> Top Player
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="font-bold text-lg">{taps}</div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapTapPage;