import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Candy, Hand } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400">
          Blockchain Gaming Platform
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Play, earn, and compete in our exclusive blockchain-powered games. 
          Connect your wallet to get started!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/sweet-bonanza"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Play Sweet Bonanza
          </Link>
          <Link
            to="/tap-tap"
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Play Tap Tap
          </Link>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Games</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sweet Bonanza Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 transition-transform hover:scale-[1.02] hover:shadow-lg">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <Candy size={80} className="text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Sweet Bonanza</h3>
              <p className="text-gray-300 mb-4">
                A delicious slot machine game where you can spin to win sweet rewards.
                Features tumbling symbols, multipliers, and free spins!
              </p>
              <Link
                to="/sweet-bonanza"
                className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
              >
                Play Now
              </Link>
            </div>
          </div>
          
          {/* Tap Tap Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 transition-transform hover:scale-[1.02] hover:shadow-lg">
            <div className="h-48 bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
              <Hand size={80} className="text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Tap Tap</h3>
              <p className="text-gray-300 mb-4">
                A competitive tapping game where the fastest tapper wins! Join active rounds, 
                tap as fast as you can, and claim rewards if you win.
              </p>
              <Link
                to="/tap-tap"
                className="inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors font-medium"
              >
                Play Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 p-6 rounded-xl border border-purple-500/20">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
            <p className="text-gray-300">
              Connect your Ethereum wallet to access the games and manage your funds securely.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-6 rounded-xl border border-purple-500/20">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Choose a Game</h3>
            <p className="text-gray-300">
              Select from our range of blockchain games - each with unique mechanics and rewards.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-6 rounded-xl border border-purple-500/20">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Play & Earn</h3>
            <p className="text-gray-300">
              Play games, compete with others, and earn rewards directly to your wallet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;