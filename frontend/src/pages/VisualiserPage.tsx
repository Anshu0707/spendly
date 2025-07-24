// src/pages/VisualiserPage.tsx
import { useState, useEffect } from "react";
import { BarChart } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";
import {
  AnalyticsHeader,
  QuickStatsGrid,
  ChartNavigation,
  ChartRenderer,
  InsightPanel,
  PeriodSelector,
} from "../components/Visualiser";

export default function VisualiserPage() {
  const { allTransactions, allLoading, allError, fetchAllTransactions } =
    useTransactions();

  const [selectedChart, setSelectedChart] = useState("Income vs Expense");
  const [selectedPeriod, setSelectedPeriod] = useState("Month");

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  if (allLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading visualiser...
      </div>
    );
  }

  if (allError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load data: {allError}
      </div>
    );
  }

  if (!allTransactions.length) {
    return (
      <div className="text-gray-400 text-center mt-10">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 overflow-y-auto my-2 ">
      <AnalyticsHeader
        icon={
          <BarChart className="w-12 h-12 md:w-16 md:h-16 text-violet-400 drop-shadow-lg" />
        }
      />

      <QuickStatsGrid transactions={allTransactions} />

      {/* CHART SECTION */}
      <div className="bg-gradient-to-br from-slate-800/40 to-purple-800/30 backdrop-blur-md rounded-2xl border border-violet-600/30 p-2 shadow-lg space-y-6 my-4">
        <ChartNavigation
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />

        <ChartRenderer
          selectedChart={selectedChart}
          selectedPeriod={selectedPeriod}
          transactions={allTransactions}
        />

        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>
      <InsightPanel transactions={allTransactions} />
    </div>
  );
}
