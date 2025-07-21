import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [allLoading, setAllLoading] = useState(false);
  const [allError, setAllError] = useState<string | null>(null);

  topbar.config({
    barColors: { "0": "#a78bfa", "1.0": "#ec4899" },
    shadowBlur: 10,
    shadowColor: "rgba(236, 72, 153, 0.2)",
    className: "z-[9999]",
  });

  const fetchTransactions = useCallback(
    (reset = false, customPage = page, customSize = size) => {
      setLoading(true);
      setError(null);
      topbar.show();
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
        .finally(() => {
          setLoading(false);
          topbar.hide();
        });
    },
    [apiUrl, page, size]
  );

  const fetchAllTransactions = useCallback(() => {
    setAllLoading(true);
    setAllError(null);
    topbar.show();
    fetch(`${apiUrl}/api/transactions`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch all transactions");
        return res.json();
      })
      .then((data) => {
        // If paginated, data will be an object; if not, it's an array
        setAllTransactions(Array.isArray(data) ? data : data.content || []);
      })
      .catch((err) => setAllError(err.message))
      .finally(() => {
        setAllLoading(false);
        topbar.hide();
      });
  }, [apiUrl]);

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
