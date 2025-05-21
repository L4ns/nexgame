import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { defineChain } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SweetBonanzaPage from './pages/SweetBonanzaPage';
import TapTapPage from './pages/TapTapPage';
import WalletConnect from './components/WalletConnect';
import { Web3ContextProvider } from './contexts/Web3Context';

// Define Nexus chain
const nexus = defineChain({
  id: 393,
  name: 'Nexus',
  nativeCurrency: {
    name: 'Nexus',
    symbol: 'NXS',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.nexus.xyz/http'] },
    public: { http: ['https://rpc.nexus.xyz/http'] },
    webSocket: { http: ['wss://rpc.nexus.xyz/ws'] },
  },
  blockExplorers: {
    default: {
      name: 'Nexus Explorer',
      url: 'https://nexus-new.explorer.caldera.xyz',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
});

// Create wagmi config
const config = createConfig({
  chains: [nexus],
  transports: {
    [nexus.id]: http(),
  },
});

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <Web3ContextProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white flex flex-col">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/sweet-bonanza" element={<SweetBonanzaPage />} />
                  <Route path="/tap-tap" element={<TapTapPage />} />
                </Routes>
              </main>
              <Footer />
              <WalletConnect />
            </div>
          </Router>
        </Web3ContextProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;