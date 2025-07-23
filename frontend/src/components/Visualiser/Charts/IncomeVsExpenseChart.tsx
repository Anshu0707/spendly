// src/components/visualiser/Charts/IncomeVsExpenseChart.tsx
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { useMemo } from "react";
import { filterByPeriod } from "@/utils/filterByPeriod";
import type { Transaction } from "@/types/transaction";

type Props = {
  transactions: Transaction[];
  selectedPeriod: string;
  showIncome: boolean;
  showExpense: boolean;
  onToggle: (type: "INCOME" | "EXPENSE") => void;
};

type ChartData = {
  month: string;
  income: number;
  expense: number;
};

export default function IncomeVsExpenseChart({
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

  const data: ChartData[] = filtered.reduce((acc, tx) => {
    const month = format(new Date(tx.date), "MMM yyyy");
    const existing = acc.find((d) => d.month === month);

    if (existing) {
      if (tx.transactionType === "INCOME") existing.income += tx.amount;
      else if (tx.transactionType === "EXPENSE") existing.expense += tx.amount;
    } else {
      acc.push({
        month,
        income: tx.transactionType === "INCOME" ? tx.amount : 0,
        expense: tx.transactionType === "EXPENSE" ? tx.amount : 0,
      });
    }
    return acc;
  }, [] as ChartData[]);

  const renderLegendText = (value: string) => {
    const isIncome = value.toLowerCase() === "income";
    const isHidden = isIncome ? !showIncome : !showExpense;

    return (
      <span
        onClick={() => onToggle(isIncome ? "INCOME" : "EXPENSE")}
        className={`cursor-pointer transition-all duration-200 ${
          isHidden
            ? "line-through text-gray-400 hover:text-white"
            : "text-white hover:text-violet-300"
        }`}
      >
        {value}
      </span>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="month" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
          labelStyle={{ color: "#fff" }}
        />
        <Legend formatter={renderLegendText} />

        {/* Always render both bars; control visibility via fillOpacity */}
        <Bar
          dataKey="income"
          fill="#10b981"
          fillOpacity={showIncome ? 1 : 0}
          isAnimationActive={false}
        />
        <Bar
          dataKey="expense"
          fill="#ef4444"
          fillOpacity={showExpense ? 1 : 0}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
