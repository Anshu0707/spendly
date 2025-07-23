// src/components/visualiser/InsightPanel.tsx
import type { Transaction } from "@/types/transaction";

type InsightPanelProps = {
  transactions: Transaction[];
};

export default function InsightPanel({ transactions }: InsightPanelProps) {
  if (transactions.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-yellow-100 text-yellow-900 dark:bg-yellow-800/20 dark:text-yellow-100">
        No transactions available for the selected period.
      </div>
    );
  }

  const largestTx = [...transactions].sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg mt-6">
      <h3 className="text-lg font-semibold mb-2">Insight</h3>
      <p className="text-sm opacity-80">
        Highest transaction: ₹{largestTx.amount.toLocaleString("en-IN")} in{" "}
        <strong>{largestTx.category}</strong> ({largestTx.transactionType})
      </p>
    </div>
  );
}
