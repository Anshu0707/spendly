// src/components/visualiser/charts/TrendLineChart.tsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { filterByPeriod } from "../../../utils/filterByPeriod";
import type { Transaction } from "@/types/transaction";
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
  income: number;
  expense: number;
};

export default function TrendLineChart({
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

  const groupedMap = new Map<string, { income: number; expense: number }>();

  for (const tx of filtered) {
    const date = format(new Date(tx.date), "dd MMM");
    const existing = groupedMap.get(date) ?? { income: 0, expense: 0 };

    if (tx.transactionType === "INCOME") {
      existing.income += tx.amount;
    } else if (tx.transactionType === "EXPENSE") {
      existing.expense += tx.amount;
    }

    groupedMap.set(date, existing);
  }

  const data: ChartData[] = Array.from(groupedMap.entries()).map(
    ([date, { income, expense }]) => ({
      date,
      income,
      expense,
    })
  );

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
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {showIncome && (
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            )}
            {showExpense && (
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500 italic mt-10">
          No data to display for current toggles
        </p>
      )}
    </div>
  );
}
