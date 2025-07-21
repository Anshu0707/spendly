import type { Transaction } from "../../contexts/TransactionContext";
import { TransactionRow } from "./TransactionRow";
import { useEffect, useRef } from "react";
import { useTransactions } from "../../contexts/TransactionContext";

type TransactionListProps = {
  transactions: Transaction[];
  colorClass: string;
  maxHeight?: string;
};

export function TransactionList({
  transactions,
  colorClass,
  maxHeight,
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

  return (
    <div
      ref={listRef}
      className="flex-1 w-full overflow-y-auto overflow-x-hidden pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={maxHeight ? { maxHeight } : undefined}
    >
      {/* Fixed Header Row */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6 mb-0">
        <div className="flex items-center justify-between w-full text-gray-300 font-semibold">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <span>Category</span>
          </div>
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
