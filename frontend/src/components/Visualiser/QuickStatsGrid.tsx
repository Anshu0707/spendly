// src/components/visualiser/QuickStatsGrid.tsx
import StatCard from "./StatsCard";
import type { Transaction } from "@/types/transaction";

type QuickStatsGridProps = {
  transactions: Transaction[];
};

export default function QuickStatsGrid({ transactions }: QuickStatsGridProps) {
  const totalIncome = transactions
    .filter((tx) => tx.transactionType === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.transactionType === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard
        label="Total Income"
        value={totalIncome}
        className="bg-green-600/70 text-white"
      />
      <StatCard
        label="Total Expenses"
        value={totalExpenses}
        className="bg-red-600/70 text-white"
      />
      <StatCard
        label="Net Balance"
        value={netBalance}
        className="bg-blue-700/70 text-white"
      />
    </div>
  );
}
