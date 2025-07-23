// src/components/visualiser/charts/CategoryAnalysisChart.tsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
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

const COLORS = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
  "#f472b6",
];

type DataItem = {
  name: string;
  value: number;
};

export default function CategoryAnalysisChart({
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

  const expenseData: DataItem[] = [];
  const incomeData: DataItem[] = [];

  for (const tx of filtered) {
    const target = tx.transactionType === "INCOME" ? incomeData : expenseData;
    const existing = target.find((item) => item.name === tx.category);

    if (existing) {
      existing.value += tx.amount;
    } else {
      target.push({ name: tx.category, value: tx.amount });
    }
  }

  const pieData = [
    {
      label: "Income Categories",
      data: incomeData,
      visible: showIncome,
      type: "INCOME",
    },
    {
      label: "Expense Categories",
      data: expenseData,
      visible: showExpense,
      type: "EXPENSE",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pieData.map(({ label, data, visible, type }) => (
        <div key={label}>
          <h3
            onClick={() => onToggle(type)}
            className={`text-lg font-semibold mb-2 cursor-pointer transition ${
              visible
                ? "text-white hover:text-violet-300"
                : "line-through text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </h3>

          {visible && data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 italic">
              No data to display
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
