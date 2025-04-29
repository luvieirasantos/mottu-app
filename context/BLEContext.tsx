import React, { createContext, useState, useContext, ReactNode } from 'react';

type RssiLevel = 'high' | 'medium' | 'low' | 'none';

interface BLEContextType {
  rssiLevel: RssiLevel;
  setRssiLevel: (level: RssiLevel) => void;
}

const BLEContext = createContext<BLEContextType | undefined>(undefined);

export function BLEProvider({ children }: { children: ReactNode }) {
  const [rssiLevel, setRssiLevel] = useState<RssiLevel>('high');

  return (
    <BLEContext.Provider value={{ rssiLevel, setRssiLevel }}>
      {children}
    </BLEContext.Provider>
  );
}

export function useBLEContext() {
  const context = useContext(BLEContext);
  if (context === undefined) {
    throw new Error('useBLEContext must be used within a BLEProvider');
  }
  return context;
}