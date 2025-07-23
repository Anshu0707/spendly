import type { Transaction } from "@/types/transaction";

export function getInsights(transactions: Transaction[]): string[] {
  const incomeTotal = transactions
    .filter((t) => t.transactionType === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter((t) => t.transactionType === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = incomeTotal - expenseTotal;
  const savingsRate = incomeTotal > 0 ? ((balance / incomeTotal) * 100).toFixed(1) : "0";

  const expenseCategories = transactions
    .filter((t) => t.transactionType === "EXPENSE")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topCategory =
    Object.entries(expenseCategories).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  const insights: string[] = [];

  if (balance > 0) insights.push("Great job! You're saving money.");
  if (topCategory !== "N/A") insights.push(`Your biggest expense category is ${topCategory}.`);
  if (parseFloat(savingsRate) > 30) insights.push("Excellent savings rate!");
  else if (parseFloat(savingsRate) > 0) insights.push("Consider improving your savings rate.");

  return insights;
}
