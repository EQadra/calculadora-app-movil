import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

// -----------------------------
// Tipos
// -----------------------------
export interface CashRegister {
  date: string;
  opening_cash: number;
  opening_gold: number;
  opening_silver: number;
  closing_cash: number | null;
  closing_gold: number | null;
  closing_silver: number | null;
}

interface CashRegisterContextType {
  cashRegister: CashRegister | null;
  loading: boolean;
  fetchToday: () => Promise<void>;
  openCash: (data: Partial<CashRegister>) => Promise<void>;
  closeCash: (data: Partial<CashRegister>) => Promise<void>;
}

// -----------------------------
// Contexto
// -----------------------------
const CashRegisterContext = createContext<CashRegisterContextType | undefined>(undefined);

export const useCashRegister = (): CashRegisterContextType => {
  const context = useContext(CashRegisterContext);
  if (!context) {
    throw new Error('useCashRegister debe usarse dentro de un CashRegisterProvider');
  }
  return context;
};

// -----------------------------
// Provider
// -----------------------------
export const CashRegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cashRegister, setCashRegister] = useState<CashRegister | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/cash-register/actual');
      setCashRegister(res.data.data);
    } catch {
      setCashRegister(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const openCash = useCallback(async (data: Partial<CashRegister>) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/cash-register/abrir', data);
      setCashRegister(res.data.data);
    } catch (err: any) {
      throw err.response?.data?.message || 'Error al abrir caja';
    } finally {
      setLoading(false);
    }
  }, []);

  const closeCash = useCallback(async (data: Partial<CashRegister>) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/cash-register/cerrar', data);
      setCashRegister(res.data.data);
    } catch (err: any) {
      throw err.response?.data?.message || 'Error al cerrar caja';
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CashRegisterContext.Provider
      value={{
        cashRegister,
        loading,
        fetchToday,
        openCash,
        closeCash,
      }}
    >
      {children}
    </CashRegisterContext.Provider>
  );
};
