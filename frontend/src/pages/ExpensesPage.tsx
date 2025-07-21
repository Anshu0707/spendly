import { useMemo } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import { ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { TransactionList } from "../components/transactions/TransactionList";
import type { Transaction } from "../contexts/TransactionContext";

export default function ExpensesPage() {
  const { transactions, loading, error } = useTransactions();
  const expenseTransactions = useMemo(
    () =>
      transactions.filter(
        (tx: Transaction) => tx.transactionType === "EXPENSE"
      ),
    [transactions]
  );

  return (
    <div className="w-full px-4 pt-3 pb-4 h-screen flex flex-col overflow-hidden">
      <h2 className="text-3xl font-bold mb-3 text-white flex items-center gap-3">
        <ArrowTrendingDownIcon className="w-8 h-8 text-pink-400" /> Expenses
      </h2>
      {loading ? (
        <div className="text-center text-gray-300 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : expenseTransactions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No expense transactions found.
        </div>
      ) : (
        <TransactionList
          transactions={expenseTransactions}
          colorClass="border-pink-500"
        />
      )}
    </div>
  );
}
