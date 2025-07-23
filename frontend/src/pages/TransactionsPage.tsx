import { useState, useCallback } from "react";
import { useTransactions } from "../hooks/useTransactions";
import AddTransactionForm from "../components/Transactions/AddTransactionForm";
import TransactionSummary from "../components/Transactions//TransactionSummary";
import { TransactionList } from "../components/Transactions//TransactionList";
import ImportExportButtons from "../components/Transactions//ImportExportButtons";
import { motion } from "framer-motion";
const apiUrl = import.meta.env.VITE_API_URL;

export default function TransactionsPage() {
  const { transactions, refresh, loading } = useTransactions();
  const [clearing, setClearing] = useState(false);
  const handleClearAll = useCallback(async () => {
    setClearing(true);
    try {
      const res = await fetch(`${apiUrl}/api/transactions`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear transactions");
      refresh();
    } catch {
      alert("Failed to clear transactions");
    } finally {
      setClearing(false);
    }
  }, [refresh]);

  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-stretch pt-8">
      {/* Left: Form + Summary */}
      <div className="flex-1 flex flex-col gap-8 min-w-[340px] h-full justify-start">
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <span className="inline-block w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            <AddTransactionForm />
          )}
        </div>
        {!loading && <TransactionSummary />}
      </div>
      {/* Right: Transaction List */}
      <div className="flex-1 flex flex-col gap-2 min-w-[340px] h-full justify-start">
        <div className="w-full h-full flex flex-col justify-between">
          <div className="bg-gradient-to-br from-white/90 via-violet-100/80 to-pink-100/80 shadow-2xl rounded-3xl p-4 md:p-6 backdrop-blur-md border border-violet-100/60 w-full min-w-[320px] flex-1 flex flex-col overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-pink-500 text-center">
              Quick View
            </h2>
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-80 w-full">
                  <span className="inline-block w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : transactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-72"
                >
                  <svg width="80" height="80" fill="none" viewBox="0 0 80 80">
                    <rect width="80" height="80" rx="20" fill="#f3e8ff" />
                    <path
                      d="M24 40h32M40 24v32"
                      stroke="#a78bfa"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="mt-6 text-lg text-violet-400 font-semibold">
                    No transactions yet
                  </div>
                  <div className="text-gray-400">
                    Add your first transaction to get started!
                  </div>
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
        <button
          onClick={handleClearAll}
          disabled={clearing}
          className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white px-3 py-2 rounded-md font-semibold shadow-md text-sm hover:scale-[1.03] transition disabled:opacity-50 mt-2"
        >
          {clearing ? "Clearing..." : "Clear All Transactions"}
        </button>
        <div className="flex flex-col gap-2 mt-6">
          <ImportExportButtons />
        </div>
      </div>
    </section>
  );
}
