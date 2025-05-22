import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { Hand, Trophy, Clock, Users, Award, Plus } from 'lucide-react';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { TAP_TAP_CONTRACT_ADDRESS } from '../utils/constants';
import { TapTapABI } from '../utils/abis';
const TapTapPage = () => {
  const { address, isConnected, connectWallet } = useWeb3Context();
  const [activeRound, setActiveRound] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [prizePool, setPrizePool] = useState<number | null>(null);
  const [tapCount, setTapCount] = useState<number>(0);
  const [players, setPlayers] = useState<string[]>([]);
  const [playerTaps, setPlayerTaps] = useState<{[address: string]: number}>({});
  const [topPlayer, setTopPlayer] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(5);
  const [showCreateRound, setShowCreateRound] = useState<boolean>(false);
  // Initialize contract
  const getTapTapContract = () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    const publicClient = createPublicClient({
      transport: http()
    });
    const walletClient = createWalletClient({
      transport: custom(window.ethereum)
    });
    return {
      read: publicClient,
      write: walletClient,
      address: TAP_TAP_CONTRACT_ADDRESS,
      abi: TapTapABI,
    };
  };
  // Fetch current round data
  useEffect(() => {
    const fetchRoundData = async () => {
      if (!isConnected) return;
      
      try {
        const contract = getTapTapContract();
        const currentRound = await contract.read.currentRound();
        setActiveRound(Number(currentRound));
        if (currentRound) {
          const [timeRemaining, pool, roundPlayers] = await Promise.all([
            contract.read.getTimeLeft([currentRound]),
            contract.read.getPrizePool([currentRound]),
            contract.read.getPlayers([currentRound])
          ]);
          setTimeLeft(Number(timeRemaining));
          setPrizePool(Number(pool) / 1e18);
          setPlayers(roundPlayers);
          // Fetch taps for each player
          const taps = {};
          await Promise.all(
            roundPlayers.map(async (player) => {
              const playerTaps = await contract.read.getMyTaps([currentRound, player]);
              taps[player] = Number(playerTaps);
            })
          );
          setPlayerTaps(taps);
          // Determine top player
          const topAddress = Object.entries(taps)
            .sort(([, a], [, b]) => b - a)[0][0];
          setTopPlayer(topAddress);
        }
      } catch (error) {
        console.error('Error fetching round data:', error);
      }
    };
    fetchRoundData();
    const interval = setInterval(fetchRoundData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
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
  const handleTap = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    if (!activeRound || timeLeft === null || timeLeft <= 0) {
      return;
    }
    try {
      const contract = getTapTapContract();
      const tx = await contract.write.tap([BigInt(activeRound)]);
      await tx.wait();
      
      // Update local tap count
      const newTaps = await contract.read.getMyTaps([activeRound, address]);
      setTapCount(Number(newTaps));
    } catch (error) {
      console.error('Error tapping:', error);
    }
  };
  const startNewRound = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    try {
      const contract = getTapTapContract();
      const tx = await contract.write.startNewRound([BigInt(duration * 60)]);
      await tx.wait();
      
      // Fetch new round data
      const currentRound = await contract.read.currentRound();
      setActiveRound(Number(currentRound));
      setTimeLeft(duration * 60);
      setTapCount(0);
      setShowCreateRound(false);
    } catch (error) {
      console.error('Error starting new round:', error);
    }
  };
  const claimReward = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    try {
      const contract = getTapTapContract();
      const tx = await contract.write.claimReward([BigInt(activeRound!)]);
      await tx.wait();
      alert('Reward claimed successfully!');
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Failed to claim reward. Please try again.');
    }
  };
  // Rest of the component JSX remains the same
  // ... (keep existing JSX code)
};
export default TapTapPage;