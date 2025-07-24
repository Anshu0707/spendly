import { useState, useCallback } from "react";
import { useTransactions } from "../hooks/useTransactions";
import AddTransactionForm from "../components/Transactions/AddTransactionForm";
import TransactionSummary from "../components/Transactions/TransactionSummary";
import { TransactionList } from "../components/Transactions/TransactionList";
import ImportExportButtons from "../components/Transactions/ImportExportButtons";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function TransactionsPage() {
  const { transactions, refresh, loading, fetchAllTransactions } =
    useTransactions();
  const [clearing, setClearing] = useState(false);

  const handleClearAll = useCallback(async () => {
    setClearing(true);
    try {
      const res = await fetch(`${apiUrl}/api/transactions`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear transactions");
      refresh(); // Paginated list
      await fetchAllTransactions(); // Full dataset for TransactionSummary
    } catch {
      alert("Failed to clear transactions");
    } finally {
      setClearing(false);
    }
  }, [refresh, fetchAllTransactions]);

  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-stretch pt-8">
      {/* Left: Form + Summary */}
      <div className="flex-1 flex flex-col gap-8 min-w-[340px] h-full justify-start ">
        <div className="w-full">
          <AddTransactionForm />
        </div>
        {!loading && <TransactionSummary />}
      </div>

      {/* Right: Transaction List */}
      <div className="flex-1 flex flex-col gap-2 min-w-[340px] h-full justify-start">
        <div className="w-full h-full flex flex-col justify-between">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black/80 border border-gray-700 rounded-xl shadow-xl p-6 w-full min-w-[320px] flex-1 flex flex-col overflow-x-auto">
            <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-center drop">
              Quick View
            </h2>
            <div className="flex-1">
              {transactions.length === 0 && !loading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-72"
                >
                  {/* empty state content */}
                </motion.div>
              ) : (
                <TransactionList
                  transactions={transactions}
                  colorClass="border-violet-500"
                  maxHeight="360px"
                />
              )}
            </div>
          </div>
        </div>

        {/* Clear All Button with Cool Background and Icon */}
        <button
          onClick={handleClearAll}
          disabled={clearing}
          className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-4 py-2 rounded-md font-semibold shadow-md text-sm flex items-center justify-center gap-2 hover:scale-[1.03] transition disabled:opacity-50 mt-2"
        >
          <Trash2 size={16} />
          {clearing ? "Clearing..." : "Clear All Transactions"}
        </button>

        {/* Import/Export Buttons with same dropdown UI */}
        <div className="flex flex-col gap-6 mt-2 bg-gradient-to-tr from-blue-900/30 to-purple-900/20 p-2 rounded-md border border-gray-700 shadow-inner backdrop-blur-sm">
          <ImportExportButtons
            onImport={async () => {
              await refresh(); // update paginated list
              await fetchAllTransactions(); // update summary
            }}
          />
        </div>
      </div>
    </section>
  );
}
