// src/pages/VisualiserPage.tsx
import { useState, useEffect } from "react";
import { ChartBarIcon } from "@heroicons/react/24/solid";
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

  const [selectedChart, setSelectedChart] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  const handleToggle = (type: "INCOME" | "EXPENSE") => {
    if (type === "INCOME") {
      setShowIncome((prev) => !prev);
    } else {
      setShowExpense((prev) => !prev);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto my-8">
      <AnalyticsHeader
        icon={
          <ChartBarIcon className="w-12 h-12 md:w-16 md:h-16 text-violet-400 drop-shadow-lg" />
        }
      />

      <QuickStatsGrid transactions={allTransactions} />

      <ChartNavigation
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
      />

      <ChartRenderer
        selectedChart={selectedChart}
        selectedPeriod={selectedPeriod}
        transactions={allTransactions}
        showIncome={showIncome}
        showExpense={showExpense}
        onToggle={handleToggle}
      />

      <InsightPanel transactions={allTransactions} />

      <PeriodSelector
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />
    </div>
  );
}
