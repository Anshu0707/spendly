// src/components/Visualiser/Charts/TrendLineChart.tsx
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
import { filterByPeriod } from "@/utils/filterByPeriod";
import type { Transaction } from "@/types/transaction";
import { useMemo } from "react";
import { useToggleIncomeExpense } from "@/hooks/useToggleIncomeExpense";
import IncomeExpenseToggle from "../../Visualiser/Toggle/IncomeExpenseToggle";

type Props = {
  transactions: Transaction[];
  selectedPeriod: string;
};

type ChartData = {
  date: string;
  income: number;
  expense: number;
};

export default function TrendLineChart({
  transactions,
  selectedPeriod,
}: Props) {
  const { showIncome, showExpense, toggleType } = useToggleIncomeExpense();

  const filtered = useMemo(
    () => filterByPeriod(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  );

  const groupedMap = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    for (const tx of filtered) {
      const dateKey = format(new Date(tx.date), "yyyy-MM-dd");
      const existing = map.get(dateKey) ?? { income: 0, expense: 0 };

      if (tx.transactionType === "INCOME") {
        existing.income += tx.amount;
      } else if (tx.transactionType === "EXPENSE") {
        existing.expense += tx.amount;
      }

      map.set(dateKey, existing);
    }
    return map;
  }, [filtered]);

  const data: ChartData[] = useMemo(
    () =>
      Array.from(groupedMap.entries())
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, { income, expense }]) => ({
          date,
          income,
          expense,
        })),
    [groupedMap]
  );

  const hasVisibleData =
    (showIncome && data.some((d) => d.income > 0)) ||
    (showExpense && data.some((d) => d.expense > 0));

  return (
    <div className="w-full">
      <div className="ml-2">
        <IncomeExpenseToggle
          showIncome={showIncome}
          showExpense={showExpense}
          toggleType={toggleType}
        />
      </div>

      {hasVisibleData ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "dd MMM")}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => format(new Date(label), "dd MMM yyyy")}
            />
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
        <p className="text-center text-gray-500 font-poppins text-2xl text-extrabold mt-10">
          No data to display for current toggles
        </p>
      )}
    </div>
  );
}
