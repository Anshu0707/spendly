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
};

export default function ChartRenderer({
  selectedChart,
  selectedPeriod,
  transactions,
}: Props) {
  return (
    <div className="w-full h-[460px] mb-6">
      {(() => {
        switch (selectedChart) {
          case "Income vs Expense":
            return (
              <IncomeVsExpenseChart
                transactions={transactions}
                selectedPeriod={selectedPeriod}
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
      })()}
    </div>
  );
}
