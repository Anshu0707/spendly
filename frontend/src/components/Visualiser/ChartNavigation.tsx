// src/components/visualiser/ChartNavigation.tsx
import type { Dispatch, SetStateAction } from "react";
import { Banknote, Donut, ActivitySquare, LineChart } from "lucide-react";

export type ChartNavigationProps = {
  selectedChart: string;
  setSelectedChart: Dispatch<SetStateAction<string>>;
};

const chartOptions = [
  {
    label: "Income vs Expense",
    icon: <Banknote className="w-5 h-5 mr-2" />,
  },
  {
    label: "Category Analysis",
    icon: <Donut className="w-5 h-5 mr-2" />,
  },
  {
    label: "Balance Distribution",
    icon: <ActivitySquare className="w-5 h-5 mr-2" />,
  },
  {
    label: "Trend Line",
    icon: <LineChart className="w-5 h-5 mr-2" />,
  },
];

export default function ChartNavigation({
  selectedChart,
  setSelectedChart,
}: ChartNavigationProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex flex-wrap justify-center gap-4">
        {chartOptions.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() => setSelectedChart(label)}
            className={`px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-2 transition-all duration-300 backdrop-blur-md hover:scale-105
              ${
                selectedChart === label
                  ? "bg-violet-600 text-white shadow-md"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
