// src/components/visualiser/PeriodSelector.tsx
import {
  CalendarDays,
  BarChart3,
  Clock3,
  PieChart,
  TimerReset,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export type PeriodSelectorProps = {
  selectedPeriod: string;
  setSelectedPeriod: Dispatch<SetStateAction<string>>;
};

const periods = [
  {
    label: "All",
    description: "Show all available transactions.",
    icon: <BarChart3 className="w-4 h-4 mr-1" />,
  },
  {
    label: "Week",
    description: "Current calendar week only.",
    icon: <Clock3 className="w-4 h-4 mr-1" />,
  },
  {
    label: "Month",
    description: "Current calendar month only.",
    icon: <CalendarDays className="w-4 h-4 mr-1" />,
  },
  {
    label: "Quarter",
    description: "Current quarter.",
    icon: <PieChart className="w-4 h-4 mr-1" />,
  },
  {
    label: "Year",
    description: "Entire calendar year.",
    icon: <TimerReset className="w-4 h-4 mr-1" />,
  },
];

export default function PeriodSelector({
  selectedPeriod,
  setSelectedPeriod,
}: PeriodSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-14 px-4 w-full">
      <div className="flex items-center flex-wrap gap-4 justify-center">
        <span className="text-lg md:text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mr-2">
          Period:
        </span>

        {periods.map(({ label, description, icon }) => (
          <div key={label} className="relative group">
            <button
              onClick={() => setSelectedPeriod(label)}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-md border ${
                selectedPeriod === label
                  ? "bg-gradient-to-br from-black-600 to-indigo-600 text-white border-violet-500 ring-2 ring-violet-300"
                  : "bg-slate-800 text-gray-200 border-slate-600 hover:bg-slate-700 hover:border-slate-500"
              }`}
            >
              {icon}
              {label}
            </button>

            <div className="absolute z-30 hidden group-hover:block bg-white text-black text-xs rounded shadow px-3 py-2 w-52 text-center border border-gray-300 top-[-2.6rem] left-1/2 -translate-x-1/2 whitespace-normal">
              {description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
