import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface Web3ContextType {
  address: string | null;
  isConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  isConnected: false,
  connectWallet: () => {},
  disconnectWallet: () => {},
});

export const useWeb3Context = () => useContext(Web3Context);

interface Web3ContextProviderProps {
  children: ReactNode;
}

export const Web3ContextProvider = ({ children }: Web3ContextProviderProps) => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = () => {
    connect({ connector: injected() });
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return (
    <Web3Context.Provider
      value={{
        address: address || null,
        isConnected: isConnected || false,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};