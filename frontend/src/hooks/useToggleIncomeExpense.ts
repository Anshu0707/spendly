// src/hooks/useToggleIncomeExpense.ts
import { useState, useCallback } from "react";

export const useToggleIncomeExpense = () => {
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  const toggleType = useCallback((type: "INCOME" | "EXPENSE") => {
    if (type === "INCOME") setShowIncome((prev) => !prev);
    else setShowExpense((prev) => !prev);
  }, []);

  return { showIncome, showExpense, toggleType };
};
