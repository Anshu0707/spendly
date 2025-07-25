import { useEffect, useMemo } from "react";
import AnimatedNumber from "../../ui/AnimatedNumber";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { useTransactions } from "../../hooks/useTransactions";
import getFontSizeClass from "../../utils/getFontSize";

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
    return <div className="text-center py-8">Add Some Transactions !</div>;
  }

  if (allError) {
    return <div className="text-center text-red-500 py-8">{allError}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center mb-10 animate-fade-in bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-2 mx-auto mt-5">
      <div className="bg-white/80 dark:bg-neutral-900 shadow-md rounded-lg px-6 py-4 text-center hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
        <ArrowDownCircle className="mx-auto text-green-500 mb-2 w-6 h-6" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Incomes</p>
        <h2
          className={`${getFontSizeClass(
            income
          )}font-semibold font-poppins text-green-500 text-lg`}
        >
          <AnimatedNumber value={income} />
        </h2>
      </div>

      <div className="bg-white/80 dark:bg-neutral-900 shadow-md rounded-lg px-6 py-4 text-center hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
        <ArrowUpCircle className="mx-auto text-red-500 mb-2 w-6 h-6" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Expenses
        </p>
        <h2
          className={`${getFontSizeClass(
            income
          )} font-semibold font-poppins text-red-500 text-lg`}
        >
          <AnimatedNumber value={expenses} />
        </h2>
      </div>

      <div className="bg-white/80 dark:bg-neutral-900 shadow-md rounded-lg px-6 py-4 text-center hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
        <Wallet
          className={`mx-auto mb-2 w-6 h-6 ${
            balance >= 0 ? "text-blue-500" : "text-yellow-500"
          }`}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance</p>
        <h2
          className={`${getFontSizeClass(
            income
          )} font-poppins font-semibold text-lg ${
            balance >= 0 ? "text-blue-500" : "text-yellow-500"
          }`}
        >
          <AnimatedNumber value={balance} />
        </h2>
      </div>
    </div>
  );
}
