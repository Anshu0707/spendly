import { useMemo } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { TransactionList } from "../components/transactions/TransactionList";
import type { Transaction } from "../contexts/TransactionContext";

export default function IncomePage() {
  const { transactions, loading, error } = useTransactions();

  const incomeTransactions = useMemo(
    () =>
      transactions.filter(
        (tx: Transaction) =>
          tx.transactionType === "INCOME" ||
          (tx.categoryType === "SALARY" &&
            !["INCOME", "EXPENSE"].includes(tx.transactionType))
      ),
    [transactions]
  );

  return (
    <div className="w-full px-4 pt-3 pb-4 h-screen flex flex-col overflow-hidden">
      <h2 className="text-3xl font-bold mb-3 text-white flex items-center gap-3">
        <CurrencyDollarIcon className="w-8 h-8 text-green-400" /> Income
      </h2>
      {loading ? (
        <div className="text-center text-gray-300 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : incomeTransactions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No income transactions found.
        </div>
      ) : (
        <TransactionList
          transactions={incomeTransactions}
          colorClass="border-green-500"
          maxHeight="700px"
        />
      )}
    </div>
  );
}
