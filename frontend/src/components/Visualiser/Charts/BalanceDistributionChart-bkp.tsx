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
import { filterByPeriod } from "@/utils/filterByPeriod";
import { useMemo, useState } from "react";

type Props = {
  transactions: Transaction[];
  selectedPeriod: string;
};

type ChartData = {
  date: string;
  balance: number;
};

const TooltipIcon = ({ text }: { text: string }) => (
  <div className="relative group inline-block z-30">
    <span
      className="ml-1 inline-flex items-center justify-center w-4 h-4 text-black bg-white border border-gray-400 rounded-full text-xs font-bold cursor-help"
      tabIndex={0}
      aria-label={text}
    >
      ?
    </span>
    <div className="absolute z-30 hidden group-hover:block group-focus:block w-[90vw] max-w-sm p-2 text-sm bg-white text-black border border-gray-300 rounded shadow-md top-full mt-1 left-0 whitespace-normal">
      {text}
    </div>
  </div>
);

export default function BalanceDistributionChart({
  transactions,
  selectedPeriod,
}: Props) {
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  const toggleType = (type: "INCOME" | "EXPENSE") => {
    type === "INCOME"
      ? setShowIncome((prev) => !prev)
      : setShowExpense((prev) => !prev);
  };

  const filtered = useMemo(
    () => filterByPeriod(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  );

  const data: ChartData[] = useMemo(() => {
    const sortedTx = [...filtered].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const result: ChartData[] = [];
    let runningBalance = 0;

    for (const tx of sortedTx) {
      if (tx.transactionType === "INCOME" && showIncome) {
        runningBalance += tx.amount;
      } else if (tx.transactionType === "EXPENSE" && showExpense) {
        runningBalance -= tx.amount;
      }

      result.push({
        date: format(new Date(tx.date), "yyyy-MM-dd"),
        balance: runningBalance,
      });
    }

    return result;
  }, [filtered, showIncome, showExpense]);

  const hasVisibleData = showIncome || showExpense;

  return (
    <div className="w-full">
      <div className="flex justify-start flex-wrap gap-6 mb-4 ml-4 items-center">
        <div className="flex items-center gap-1">
          <span
            className={`cursor-pointer transition ${
              showIncome
                ? "text-green-500 hover:text-green-400"
                : "line-through text-gray-500 hover:text-white"
            }`}
            onClick={() => toggleType("INCOME")}
          >
            Income
          </span>
          <TooltipIcon text="Include income transactions when calculating running balance over time." />
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`cursor-pointer transition ${
              showExpense
                ? "text-red-400 hover:text-red-300"
                : "line-through text-gray-500 hover:text-white"
            }`}
            onClick={() => toggleType("EXPENSE")}
          >
            Expense
          </span>
          <TooltipIcon text="Include expense transactions when calculating running balance over time." />
        </div>
      </div>

      {hasVisibleData && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "dd MMM")}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => format(new Date(label), "dd MMM yyyy")}
            />
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
