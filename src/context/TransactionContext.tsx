// context/TransactionContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Transaction {
  id: number;
  cash_register_id: number;
  type: 'compra' | 'venta';
  metal_type: 'oro' | 'plata';
  grams: number;
  purity?: number;
  discount_percentage?: number;
  price_per_gram: number;
  total_pen: number;
  total_usd: number;
  exchange_rate: number;
  hora?: string;
  created_by: number;
  created_at?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: number) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      cash_register_id: 1,
      type: 'compra',
      metal_type: 'oro',
      grams: 10,
      purity: 95,
      discount_percentage: 0,
      price_per_gram: 250,
      total_pen: 2500,
      total_usd: 678.5,
      exchange_rate: 3.68,
      hora: '09:30',
      created_by: 1,
      created_at: '2025-07-04T09:30:00Z',
    },
    {
      id: 2,
      cash_register_id: 2,
      type: 'venta',
      metal_type: 'plata',
      grams: 100,
      purity: 90,
      price_per_gram: 3.2,
      total_pen: 320,
      total_usd: 86.9,
      exchange_rate: 3.68,
      created_by: 2,
      created_at: '2025-07-04T10:45:00Z',
    },
  ]);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, { ...tx, id: Date.now() }]);
  };

  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions debe usarse dentro de TransactionProvider');
  }
  return context;
};
