import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Moto {
  id: string;
  placa: string;
  zona: string;
  status: string;
  observacoes?: string;
  dataRegistro?: string;
  dataAtualizacao?: string;
}

interface MotoContextType {
  motos: Moto[];
  addMoto: (moto: Moto) => void;
  updateMoto: (moto: Moto) => void;
  removeMoto: (id: string) => void;
  getMotoById: (id: string) => Moto | undefined;
}

const MotoContext = createContext<MotoContextType | undefined>(undefined);

export function MotoProvider({ children }: { children: ReactNode }) {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('motos');
        if (storedData) {
          setMotos(JSON.parse(storedData));
        } else {
          // Add sample data if nothing is stored
          const sampleData: Moto[] = [
            {
              id: '1',
              placa: 'ABC1D23',
              zona: 'A1',
              status: 'Ativa',
              observacoes: 'Moto em perfeito estado',
              dataRegistro: new Date().toISOString()
            },
            {
              id: '2',
              placa: 'XYZ9F87',
              zona: 'B2',
              status: 'Em Manutenção',
              observacoes: 'Necessita revisão no motor',
              dataRegistro: new Date().toISOString()
            }
          ];
          setMotos(sampleData);
          await AsyncStorage.setItem('motos', JSON.stringify(sampleData));
        }
      } catch (error) {
        console.error('Error loading data', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      if (isLoaded) {
        try {
          await AsyncStorage.setItem('motos', JSON.stringify(motos));
        } catch (error) {
          console.error('Error saving data', error);
        }
      }
    };

    saveData();
  }, [motos, isLoaded]);

  const addMoto = (moto: Moto) => {
    setMotos(prev => [...prev, moto]);
  };

  const updateMoto = (updatedMoto: Moto) => {
    setMotos(prev => 
      prev.map(moto => 
        moto.id === updatedMoto.id ? { ...moto, ...updatedMoto } : moto
      )
    );
  };

  const removeMoto = (id: string) => {
    setMotos(prev => prev.filter(moto => moto.id !== id));
  };

  const getMotoById = (id: string) => {
    return motos.find(moto => moto.id === id);
  };

  return (
    <MotoContext.Provider value={{ motos, addMoto, updateMoto, removeMoto, getMotoById }}>
      {children}
    </MotoContext.Provider>
  );
}

export function useMotoContext() {
  const context = useContext(MotoContext);
  if (context === undefined) {
    throw new Error('useMotoContext must be used within a MotoProvider');
  }
  return context;
}