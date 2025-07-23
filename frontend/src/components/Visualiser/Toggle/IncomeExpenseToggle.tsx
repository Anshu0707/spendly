import TooltipIcon from "../UI/TooltipIcon"; // ✅

type IncomeExpenseToggleProps = {
  showIncome: boolean;
  showExpense: boolean;
  toggleType: (type: "INCOME" | "EXPENSE") => void;
  withTooltip?: boolean;
};

const IncomeExpenseToggle = ({
  showIncome,
  showExpense,
  toggleType,
  withTooltip = false,
}: IncomeExpenseToggleProps) => (
  <div className="flex justify-start flex-wrap gap-6 mb-4 ml-2 items-center min-h-[32px]">
    <div className="flex items-center gap-1">
      <span
        className={`cursor-pointer transition ${
          showIncome
            ? "text-green-500 hover:text-green-400"
            : "line-through text-gray-500 hover:text-white"
        }`}
        onClick={() => toggleType("INCOME")}
      >
        Income
      </span>
      {withTooltip && (
        <TooltipIcon text="Include income transactions when calculating running balance over time." />
      )}
    </div>

    <div className="flex items-center gap-1">
      <span
        className={`cursor-pointer transition ${
          showExpense
            ? "text-red-400 hover:text-red-300"
            : "line-through text-gray-500 hover:text-white"
        }`}
        onClick={() => toggleType("EXPENSE")}
      >
        Expense
      </span>
      {withTooltip && (
        <TooltipIcon text="Include expense transactions when calculating running balance over time." />
      )}
    </div>
  </div>
);

export default IncomeExpenseToggle;
