import type { Transaction } from "../../types/transaction";
import { TransactionRow } from "./TransactionRow";
import { PieChart } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useTransactions } from "../../hooks/useTransactions";

type TransactionListProps = {
  transactions: Transaction[];
  colorClass: string;
  maxHeight?: string;
  headerControls?: ReactNode;
};

export function TransactionList({
  transactions,
  colorClass,
  maxHeight,
  headerControls,
}: TransactionListProps) {
  const { hasMore, loadMore, loading } = useTransactions();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = listRef.current;
      if (!el || loading || !hasMore) return;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) {
        loadMore();
      }
    };
    const el = listRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, loadMore, loading]);

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 w-full">
        <span className="inline-block w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="border border-gray-700 shadow-md rounded-none bg-black/30 backdrop-blur-md overflow-hidden">
      <div
        ref={listRef}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden pr-0 scrollbar-hide"
        style={maxHeight ? { maxHeight } : undefined}
      >
        {/* Fixed Header Row */}
        <div className="sticky top-0 z-10 p-4 bg-transparent backdrop-blur-lg border-b border-violet-300 rounded-md shadow-sm mx-0.5">
          <div className="flex items-center justify-between w-full font-semibold text-violet-800 font-poppins text-sm sm:text-base">
            <div className="flex items-center gap-10 ml-2">
              <div className="w-6 h-6 flex items-center justify-center bg-orange-300 rounded-lg shadow font-medium text-extrabold text-lg font-poppins">
                <PieChart className="w-4 h-4" />
              </div>
              <span className="text-orange-300 font-medium text-extrabold text-lg font-poppins">
                Category
              </span>
            </div>

            {headerControls && (
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                {headerControls}
              </div>
            )}

            <div className="flex items-center gap-10">
              <span className="text-center w-[120px] text-orange-300 font-medium text-extrabold text-lg font-poppins">
                Amount
              </span>
              <span className="text-center w-[110px] text-orange-300 font-medium text-extrabold text-lg font-poppins">
                Date
              </span>
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-0 w-full max-w-none">
          {transactions.map((tx) => (
            <TransactionRow
              key={tx.id ?? `${tx.date}-${tx.amount}-${tx.category}`}
              transaction={tx}
              colorClass={colorClass}
            />
          ))}
        </ul>

        {loading && hasMore && (
          <div className="py-4 text-center text-blue-700">Loading more...</div>
        )}
      </div>
    </div>
  );
}
