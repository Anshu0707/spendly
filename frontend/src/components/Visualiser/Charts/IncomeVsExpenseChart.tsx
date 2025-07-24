// src/components/Visualiser/Charts/IncomeVsExpenseChart.tsx
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  parse,
} from "date-fns";
import { useMemo } from "react";
import { filterByPeriod } from "@/utils/filterByPeriod";
import type { Transaction } from "@/types/transaction";
import { useToggleIncomeExpense } from "@/hooks/useToggleIncomeExpense";
import IncomeExpenseToggle from "../../Visualiser/Toggle/IncomeExpenseToggle";

type Props = {
  transactions: Transaction[];
  selectedPeriod: string;
};

type ChartData = {
  label: string;
  income: number;
  expense: number;
};

export default function IncomeVsExpenseChart({
  transactions,
  selectedPeriod,
}: Props) {
  const { showIncome, showExpense, toggleType } = useToggleIncomeExpense();

  const filtered = useMemo(
    () => filterByPeriod(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  );

  const getLabelFormat = (period: string): string => {
    switch (period) {
      case "Week":
        return "EEE dd";
      case "Month":
        return "dd MMM";
      case "Quarter":
      case "Year":
      default:
        return "MMM yyyy";
    }
  };

  const { start, end } = useMemo(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case "Week":
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        };
      case "Month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "Quarter":
        return { start: startOfQuarter(now), end: endOfQuarter(now) };
      case "Year":
        return { start: startOfYear(now), end: endOfYear(now) };
      default:
        return { start: new Date(0), end: now };
    }
  }, [selectedPeriod]);

  const data: ChartData[] = useMemo(() => {
    const formatStr = getLabelFormat(selectedPeriod);

    if (selectedPeriod === "All") {
      const uniqueLabels = Array.from(
        new Set(filtered.map((tx) => format(new Date(tx.date), formatStr)))
      ).sort(
        (a, b) =>
          parse(a, formatStr, new Date()).getTime() -
          parse(b, formatStr, new Date()).getTime()
      );

      return uniqueLabels.map((label) => {
        const txs = filtered.filter(
          (tx) => format(new Date(tx.date), formatStr) === label
        );
        return {
          label,
          income: txs
            .filter((t) => t.transactionType === "INCOME")
            .reduce((sum, t) => sum + t.amount, 0),
          expense: txs
            .filter((t) => t.transactionType === "EXPENSE")
            .reduce((sum, t) => sum + t.amount, 0),
        };
      });
    }

    const range =
      selectedPeriod === "Quarter" || selectedPeriod === "Year"
        ? eachMonthOfInterval({ start, end })
        : eachDayOfInterval({ start, end });

    const defaultData: ChartData[] = range.map((date) => ({
      label: format(date, formatStr),
      income: 0,
      expense: 0,
    }));

    for (const tx of filtered) {
      const label = format(new Date(tx.date), formatStr);
      const entry = defaultData.find((d) => d.label === label);
      if (!entry) continue;

      tx.transactionType === "INCOME"
        ? (entry.income += tx.amount)
        : (entry.expense += tx.amount);
    }

    return defaultData;
  }, [filtered, selectedPeriod, start, end]);

  return (
    <div className="w-full">
      <IncomeExpenseToggle
        showIncome={showIncome}
        showExpense={showExpense}
        toggleType={toggleType}
      />
      <div className="min-h-[420px] flex items-center justify-center">
        {data.length > 0 && (showIncome || showExpense) ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <XAxis dataKey="label" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#10b981"
                fillOpacity={showIncome ? 1 : 0}
                isAnimationActive={false}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                fillOpacity={showExpense ? 1 : 0}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 font-poppins text-2xl font-extrabold">
            No data to display for selected period
          </p>
        )}
      </div>
    </div>
  );
}
