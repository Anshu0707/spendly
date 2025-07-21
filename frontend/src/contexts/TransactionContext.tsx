import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  hasMore: boolean;
  loadMore: () => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchTransactions = useCallback(
    (reset = false, customPage = page, customSize = size) => {
      setLoading(true);
      setError(null);
      fetch(`${apiUrl}/api/transactions?page=${customPage}&size=${customSize}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch transactions");
          return res.json();
        })
        .then((data) => {
          // Spring Page object: { content, totalPages, totalElements, ... }
          setTotalPages(data.totalPages || 1);
          setTotalElements(data.totalElements || 0);
          if (reset) {
            setTransactions(data.content || []);
          } else {
            setTransactions((prev) => [...prev, ...(data.content || [])]);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    },
    [apiUrl, page, size]
  );

  useEffect(() => {
    // On mount or when size changes, reset and load first page
    setTransactions([]);
    setPage(0);
    fetchTransactions(true, 0, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const refresh = useCallback(() => {
    setTransactions([]);
    setPage(0);
    fetchTransactions(true, 0, size);
  }, [fetchTransactions, size]);

  const hasMore = page + 1 < totalPages;

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(false, nextPage, size);
  }, [hasMore, loading, page, size, fetchTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        refresh,
        page,
        size,
        totalPages,
        totalElements,
        setPage,
        setSize,
        hasMore,
        loadMore,
      }}
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
