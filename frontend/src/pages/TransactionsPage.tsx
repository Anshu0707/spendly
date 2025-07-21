import { useState, useCallback } from "react";
import { useTransactions } from "../features/transactions/TransactionContext";
import AddTransactionForm from "../features/transactions/AddTransactionForm";
import TransactionSummary from "../features/transactions/TransactionSummary";
import TransactionList from "../features/transactions/TransactionList";
import ImportExportButtons from "../features/transactions/ImportExportButtons";
const apiUrl = import.meta.env.VITE_API_URL;

export default function TransactionsPage() {
  const { refresh } = useTransactions();
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
          <AddTransactionForm />
        </div>
        <TransactionSummary />
      </div>
      {/* Right: Transaction List */}
      <div className="flex-1 flex flex-col gap-2 min-w-[340px] h-full justify-start">
        <div className="w-full h-full flex flex-col justify-between">
          <div className="bg-gradient-to-br from-white/90 via-violet-100/80 to-pink-100/80 shadow-2xl rounded-3xl p-4 md:p-6 backdrop-blur-md border border-violet-100/60 w-full min-w-[320px] flex-1 flex flex-col overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-pink-500 text-center">
              Quick View
            </h2>
            <div className="flex-1">
              <TransactionList />
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
