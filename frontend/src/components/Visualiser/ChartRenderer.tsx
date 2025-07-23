// src/components/visualiser/ChartRenderer.tsx
import type { Transaction } from "@/types/transaction";
import IncomeVsExpenseChart from "./Charts/IncomeVsExpenseChart";
import CategoryAnalysisChart from "./Charts/CategoryAnalysisChart";
import BalanceDistributionChart from "./Charts/BalanceDistributionChart";
import TrendLineChart from "./Charts/TrendLineChart";

type Props = {
  selectedChart: string;
  selectedPeriod: string;
  transactions: Transaction[];
  showIncome?: boolean;
  showExpense?: boolean;
  onToggle?: (type: "INCOME" | "EXPENSE") => void;
};

export default function ChartRenderer({
  selectedChart,
  selectedPeriod,
  transactions,
  showIncome,
  showExpense,
  onToggle,
}: Props) {
  switch (selectedChart) {
    case "Income vs Expense":
      // ✅ Ensure required props are defined
      if (
        typeof showIncome === "undefined" ||
        typeof showExpense === "undefined" ||
        typeof onToggle !== "function"
      ) {
        console.error("ChartRenderer: Missing props for IncomeVsExpenseChart.");
        return null;
      }

      return (
        <IncomeVsExpenseChart
          transactions={transactions}
          selectedPeriod={selectedPeriod}
          showIncome={showIncome}
          showExpense={showExpense}
          onToggle={onToggle}
        />
      );

    case "Category Analysis":
      return (
        <CategoryAnalysisChart
          transactions={transactions}
          selectedPeriod={selectedPeriod}
        />
      );

    case "Balance Distribution":
      return (
        <BalanceDistributionChart
          transactions={transactions}
          selectedPeriod={selectedPeriod}
        />
      );

    case "Trend Line":
      return (
        <TrendLineChart
          transactions={transactions}
          selectedPeriod={selectedPeriod}
        />
      );

    default:
      return null;
  }
}
