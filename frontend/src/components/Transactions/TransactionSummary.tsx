import { useEffect, useMemo } from "react";
import AnimatedNumber from "../../ui/AnimatedNumber";
import { useTransactions } from "../../hooks/useTransactions";

export default function TransactionSummary() {
  const { allTransactions, allLoading, allError, fetchAllTransactions } =
    useTransactions();

  useEffect(() => {
    // Fetch only once if data is not already present
    if (allTransactions.length === 0 && !allLoading) {
      fetchAllTransactions();
    }
  }, [fetchAllTransactions]);

  const { income, expenses, balance } = useMemo(() => {
    const income = allTransactions
      .filter((t) => t.transactionType === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = allTransactions
      .filter((t) => t.transactionType === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = income - expenses;

    return { income, expenses, balance };
  }, [allTransactions]);

  if (allLoading || allTransactions.length === 0) {
    return <div className="text-center py-8">Loading data...</div>;
  }

  if (allError) {
    return <div className="text-center text-red-500 py-8">{allError}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center mb-10 animate-fade-in">
      <div className="bg-white/80 dark:bg-neutral-900 shadow-md rounded-lg px-6 py-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Incomes</p>
        <h2 className="text-2xl font-semibold text-green-500">
          <AnimatedNumber value={income} />
        </h2>
      </div>
      <div className="bg-white/80 dark:bg-neutral-900 shadow-md rounded-lg px-6 py-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Expenses
        </p>
        <h2 className="text-2xl font-semibold text-red-500">
          <AnimatedNumber value={expenses} />
        </h2>
      </div>
      <div className="bg-white/80 dark:bg-neutral-900 shadow-md rounded-lg px-6 py-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance</p>
        <h2
          className={`text-2xl font-semibold ${
            balance >= 0 ? "text-blue-500" : "text-yellow-500"
          }`}
        >
          <AnimatedNumber value={balance} />
        </h2>
      </div>
    </div>
  );
}
