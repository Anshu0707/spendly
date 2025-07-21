import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

export type Transaction = {
  id?: number;
  amount: number;
  transactionType: string;
  category: string;
  categoryType?: string;
  date: string;
};

type TransactionContextType = {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = () => {
    setLoading(true);
    setError(null);
    fetch(`${apiUrl}/api/transactions`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then((data) => setTransactions(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{ transactions, loading, error, refresh: fetchTransactions }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
}
