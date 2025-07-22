import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import topbar from "topbar";
import "nprogress/nprogress.css";

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
  allTransactions: Transaction[];
  allLoading: boolean;
  allError: string | null;
  fetchAllTransactions: () => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [allLoading, setAllLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [allError, setAllError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    topbar.config({
      barColors: { "0": "#a78bfa", "1.0": "#ec4899" },
      shadowBlur: 10,
      shadowColor: "rgba(236, 72, 153, 0.2)",
      className: "z-[9999]",
    });
  }, []);

  const fetchTransactions = useCallback(
    async (reset = false, customPage = page, customSize = size) => {
      setLoading(true);
      setError(null);
      topbar.show();

      try {
        const res = await fetch(
          `${apiUrl}/api/transactions?page=${customPage}&size=${customSize}`
        );
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const data = await res.json();
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
        const newTransactions = data.content || [];

        setTransactions((prev) =>
          reset ? newTransactions : [...prev, ...newTransactions]
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        topbar.hide();
      }
    },
    [page, size]
  );

  const fetchAllTransactions = useCallback(async () => {
    setAllLoading(true);
    setAllError(null);
    topbar.show();

    try {
      const res = await fetch(`${apiUrl}/api/transactions`);
      if (!res.ok) throw new Error("Failed to fetch all transactions");

      const data = await res.json();
      setAllTransactions(Array.isArray(data) ? data : data.content || []);
    } catch (err: any) {
      setAllError(err.message);
    } finally {
      setAllLoading(false);
      topbar.hide();
    }
  }, []);

  useEffect(() => {
    // On mount or when size changes
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

  const hasMore = useMemo(() => page + 1 < totalPages, [page, totalPages]);

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
        allTransactions,
        allLoading,
        allError,
        fetchAllTransactions,
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
