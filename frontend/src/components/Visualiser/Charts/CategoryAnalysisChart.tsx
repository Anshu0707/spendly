// src/components/Visualiser/Charts/CategoryAnalysisChart.tsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { filterByPeriod } from "@/utils/filterByPeriod";
import type { Transaction } from "@/types/transaction";
import { useMemo } from "react";
import { useToggleIncomeExpense } from "@/hooks/useToggleIncomeExpense";
import IncomeExpenseToggle from "../../Visualiser/Toggle/IncomeExpenseToggle";

type Props = {
  transactions: Transaction[];
  selectedPeriod: string;
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
}: Props) {
  const { showIncome, showExpense, toggleType } = useToggleIncomeExpense();

  const filtered = useMemo(
    () => filterByPeriod(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  );

  const { incomeData, expenseData } = useMemo(() => {
    const income: DataItem[] = [];
    const expense: DataItem[] = [];

    for (const tx of filtered) {
      const list = tx.transactionType === "INCOME" ? income : expense;
      const existing = list.find((item) => item.name === tx.category);

      existing
        ? (existing.value += tx.amount)
        : list.push({ name: tx.category, value: tx.amount });
    }

    return { incomeData: income, expenseData: expense };
  }, [filtered]);

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
    <div>
      <IncomeExpenseToggle
        showIncome={showIncome}
        showExpense={showExpense}
        toggleType={toggleType}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pieData.map(({ label, data, visible }) => (
          <div key={label}>
            <h3 className="text-lg font-semibold mb-2">{label}</h3>
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
              <p className="text-center text-gray-500 font-poppins text-2xl text-extrabold">
                No data to display
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
