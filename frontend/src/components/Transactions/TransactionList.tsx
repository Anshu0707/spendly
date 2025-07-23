import type { Transaction } from "../../types/transaction";
import { TransactionRow } from "./TransactionRow";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 w-full">
        <span className="inline-block w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="flex-1 w-full overflow-y-auto overflow-x-hidden pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={maxHeight ? { maxHeight } : undefined}
    >
      {/* Fixed Header Row */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-violet-200 p-6 mb-0 relative">
        <div className="flex items-center justify-between w-full text-violet-700 font-semibold">
          <div className="flex items-center gap-10 ml-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <span>Category</span>
          </div>
          {headerControls && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              {headerControls}
            </div>
          )}
          <div className="flex items-center gap-8">
            <span className="text-center w-[120px]">Amount</span>
            <span className="text-center w-[110px]">Date</span>
          </div>
        </div>
      </div>
      <ul className="flex flex-col gap-0 w-full max-w-none">
        {transactions.map((tx, index) => (
          <TransactionRow
            key={index}
            transaction={tx}
            colorClass={colorClass}
          />
        ))}
      </ul>
      {loading && hasMore && (
        <div className="py-4 text-center text-gray-400">Loading more...</div>
      )}
    </div>
  );
}
