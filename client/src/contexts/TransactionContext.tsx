import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction } from '@/lib/types';
import { useAuth } from './AuthContext';

export interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByUser: (userId: string) => Transaction[];
  getTransactionsByDateRange: (userId: string, startDate: string, endDate: string) => Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions));
      } catch (error) {
        console.error('Failed to parse stored transactions:', error);
        localStorage.removeItem('transactions');
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(transactions.map(tx => (tx.id === id ? { ...tx, ...updates } : tx)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  const getTransactionsByUser = (userId: string) => {
    return transactions.filter(tx => tx.userId === userId);
  };

  const getTransactionsByDateRange = (userId: string, startDate: string, endDate: string) => {
    return transactions.filter(tx => {
      if (tx.userId !== userId) return false;
      const txDate = new Date(tx.date).getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return txDate >= start && txDate <= end;
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionsByUser,
        getTransactionsByDateRange,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};
