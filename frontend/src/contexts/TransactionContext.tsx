import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import topbar from "topbar";
import "nprogress/nprogress.css";
import type { Transaction } from "@/types/transaction";

const apiUrl = import.meta.env.VITE_API_URL;

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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
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
      let page = 0;
      const size = 100; // fetch in batches of 100
      let hasNext = true;
      const all: Transaction[] = [];

      while (hasNext) {
        const res = await fetch(
          `${apiUrl}/api/transactions?page=${page}&size=${size}`
        );
        if (!res.ok) throw new Error(`Failed to fetch page ${page}`);

        const data = await res.json();

        const currentPageData: Transaction[] = Array.isArray(data)
          ? data
          : data.content || [];

        all.push(...currentPageData);

        const totalPages = data.totalPages ?? 1;
        page += 1;
        hasNext = page < totalPages;
      }

      setAllTransactions(all);
    } catch (err: unknown) {
      setAllError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
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

export { TransactionContext, type TransactionContextType };
