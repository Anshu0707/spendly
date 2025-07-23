// src/components/visualiser/charts/BalanceDistributionChart.tsx
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import type { Transaction } from "@/types/transaction";
import { filterByPeriod } from "../../../utils/filterByPeriod";
import { useMemo } from "react";

type Props = {
  transactions: Transaction[];
  selectedPeriod: string;
  showIncome: boolean;
  showExpense: boolean;
  onToggle: (type: "INCOME" | "EXPENSE") => void;
};

type ChartData = {
  date: string;
  balance: number;
};

export default function BalanceDistributionChart({
  transactions,
  selectedPeriod,
  showIncome,
  showExpense,
  onToggle,
}: Props) {
  const filtered = useMemo(
    () => filterByPeriod(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  );

  const sortedTx = [...filtered].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data: ChartData[] = [];
  let runningBalance = 0;

  for (const tx of sortedTx) {
    if (tx.transactionType === "INCOME" && showIncome) {
      runningBalance += tx.amount;
    } else if (tx.transactionType === "EXPENSE" && showExpense) {
      runningBalance -= tx.amount;
    }

    data.push({
      date: format(new Date(tx.date), "dd MMM"),
      balance: runningBalance,
    });
  }

  const hasVisibleData = showIncome || showExpense;

  return (
    <div className="w-full">
      <div className="flex gap-6 mb-2 ml-2">
        <span
          className={`cursor-pointer transition ${
            showIncome
              ? "text-green-500 hover:text-green-400"
              : "line-through text-gray-500 hover:text-white"
          }`}
          onClick={() => onToggle("INCOME")}
        >
          Income
        </span>
        <span
          className={`cursor-pointer transition ${
            showExpense
              ? "text-red-400 hover:text-red-300"
              : "line-through text-gray-500 hover:text-white"
          }`}
          onClick={() => onToggle("EXPENSE")}
        >
          Expense
        </span>
      </div>

      {hasVisibleData && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500 italic mt-10">
          No data to display for current toggles
        </p>
      )}
    </div>
  );
}
