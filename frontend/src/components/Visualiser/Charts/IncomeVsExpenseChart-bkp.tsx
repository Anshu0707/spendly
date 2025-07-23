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
import { useMemo, useState } from "react";
import { filterByPeriod } from "@/utils/filterByPeriod";
import type { Transaction } from "@/types/transaction";

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
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  const toggleType = (type: "INCOME" | "EXPENSE") => {
    if (type === "INCOME") {
      setShowIncome((prev) => !prev);
    } else {
      setShowExpense((prev) => !prev);
    }
  };

  const getLabelFormat = (period: string): string => {
    switch (period) {
      case "Week":
        return "EEE dd"; // Mon 08
      case "Month":
        return "dd MMM"; // 08 Jul
      case "Quarter":
      case "Year":
      default:
        return "MMM yyyy"; // Jul 2025
    }
  };

  const filtered = useMemo(
    () => filterByPeriod(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  );

  const { start, end } = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;

    switch (selectedPeriod) {
      case "Week":
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "Month":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case "Quarter":
        start = startOfQuarter(now);
        end = endOfQuarter(now);
        break;
      case "Year":
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      default:
        start = new Date(0);
        end = now;
    }

    return { start, end };
  }, [selectedPeriod]);

  const data: ChartData[] = useMemo(() => {
    const formatStr = getLabelFormat(selectedPeriod);

    if (selectedPeriod === "All") {
      const formatLabel = (tx: Transaction) =>
        format(new Date(tx.date), formatStr);

      const uniqueLabels = Array.from(new Set(filtered.map(formatLabel))).sort(
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
      const txDate = new Date(tx.date);
      const label = format(txDate, formatStr);
      const entry = defaultData.find((d) => d.label === label);
      if (!entry) continue;

      if (tx.transactionType === "INCOME") {
        entry.income += tx.amount;
      } else if (tx.transactionType === "EXPENSE") {
        entry.expense += tx.amount;
      }
    }

    return defaultData;
  }, [filtered, selectedPeriod, start, end]);

  const renderLegendText = (value: string) => {
    const isIncome = value.toLowerCase() === "income";
    const isHidden = isIncome ? !showIncome : !showExpense;

    return (
      <span
        onClick={() => toggleType(isIncome ? "INCOME" : "EXPENSE")}
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
    <div className="w-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="label" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend formatter={renderLegendText} />
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
        <p className="text-center text-gray-500 italic mt-10">
          No data to display for selected period
        </p>
      )}
    </div>
  );
}
