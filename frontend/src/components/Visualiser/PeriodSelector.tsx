// src/components/visualiser/PeriodSelector.tsx
import type { Dispatch, SetStateAction } from "react";

export type PeriodSelectorProps = {
  selectedPeriod: string;
  setSelectedPeriod: Dispatch<SetStateAction<string>>;
};

const periods = ["All Time", "Last 30 Days", "This Month", "This Year"];

export default function PeriodSelector({
  selectedPeriod,
  setSelectedPeriod,
}: PeriodSelectorProps) {
  return (
    <div className="flex gap-3 flex-wrap mt-6 mb-10">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => setSelectedPeriod(period)}
          className={`px-3 py-1 rounded-md font-medium text-sm transition ${
            selectedPeriod === period
              ? "bg-violet-700 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
