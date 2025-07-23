// src/components/visualiser/ChartNavigation.tsx
import type { Dispatch, SetStateAction } from "react";

export type ChartNavigationProps = {
  selectedChart: string;
  setSelectedChart: Dispatch<SetStateAction<string>>;
};

const chartOptions = [
  "Income vs Expense",
  "Category Analysis",
  "Balance Distribution",
  "Trend Line",
];

export default function ChartNavigation({
  selectedChart,
  setSelectedChart,
}: ChartNavigationProps) {
  return (
    <div className="flex gap-4 flex-wrap mb-6">
      {chartOptions.map((option) => (
        <button
          key={option}
          onClick={() => setSelectedChart(option)}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
            selectedChart === option
              ? "bg-violet-600 text-white"
              : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
