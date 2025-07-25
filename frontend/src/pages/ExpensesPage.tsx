import { useMemo, useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { TrendingDown, ChevronDown } from "lucide-react";
import { TransactionList } from "../components/Transactions/TransactionList";
import type { Transaction } from "../types/transaction";

function sortTransactions(
  transactions: Transaction[],
  sortAmount: string,
  sortMonth: string
) {
  const sorted = [...transactions];
  if (sortAmount !== "none") {
    sorted.sort((a, b) =>
      sortAmount === "asc" ? a.amount - b.amount : b.amount - a.amount
    );
  }
  if (sortMonth !== "none") {
    sorted.sort((a, b) => {
      const aMonth = new Date(a.date).getMonth();
      const bMonth = new Date(b.date).getMonth();
      return sortMonth === "asc" ? aMonth - bMonth : bMonth - aMonth;
    });
  }
  return sorted;
}

export default function ExpensesPage() {
  const { transactions, loading, error } = useTransactions();
  const [sortAmount, setSortAmount] = useState("none");
  const [sortMonth, setSortMonth] = useState("none");

  const expenseTransactions = useMemo(
    () =>
      transactions.filter(
        (tx: Transaction) => tx.transactionType === "EXPENSE"
      ),
    [transactions]
  );

  const sortedTransactions = useMemo(
    () => sortTransactions(expenseTransactions, sortAmount, sortMonth),
    [expenseTransactions, sortAmount, sortMonth]
  );

  const handleSortAmount = (val: string) => {
    setSortAmount(val === "reset" ? "none" : val);
    if (val !== "none" && val !== "reset") setSortMonth("none");
  };
  const handleSortMonth = (val: string) => {
    setSortMonth(val === "reset" ? "none" : val);
    if (val !== "none" && val !== "reset") setSortAmount("none");
  };

  const headerControls = (
    <>
      <div className="relative min-w-[180px]">
        <select
          className="appearance-none rounded-xl px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-gray-200 border-2 border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 shadow-lg font-semibold transition-all w-full pr-8 focus:scale-105"
          value={sortAmount}
          onChange={(e) => handleSortAmount(e.target.value)}
        >
          <option value="none" disabled hidden>
            Sort by Amount
          </option>
          <option value="reset">None</option>
          <option value="asc">Amount: Low to High</option>
          <option value="desc">Amount: High to Low</option>
        </select>
        <ChevronDown className="w-4 h-4 text-pink-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      <div className="relative min-w-[180px]">
        <select
          className="appearance-none rounded-xl px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-gray-200 border-2 border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 shadow-lg font-semibold transition-all w-full pr-8 focus:scale-105"
          value={sortMonth}
          onChange={(e) => handleSortMonth(e.target.value)}
        >
          <option value="none" disabled hidden>
            Sort by Month
          </option>
          <option value="reset">None</option>
          <option value="asc">Month: Low to High</option>
          <option value="desc">Month: High to Low</option>
        </select>
        <ChevronDown className="w-4 h-4 text-pink-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </>
  );

  return (
    <div className="w-full px-4 pt-3 pb-4 h-screen flex flex-col overflow-hidden">
      <h2 className="text-3xl font-bold mb-3 text-white flex items-center gap-3">
        <TrendingDown className="w-8 h-8 text-pink-400" /> Expenses
      </h2>
      {loading ? (
        <div className="text-center text-gray-300 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : sortedTransactions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No expense transactions found.
        </div>
      ) : (
        <TransactionList
          transactions={sortedTransactions}
          colorClass="border-pink-500 border-solid"
          maxHeight="800px"
          headerControls={headerControls}
        />
      )}
    </div>
  );
}
