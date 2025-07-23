import type { Transaction } from "@/types/transaction";

export function getRecommendations(transactions: Transaction[]): string[] {
  const recommendations: string[] = [];

  recommendations.push("Track your spending patterns regularly.");
  recommendations.push("Set monthly budget goals.");

  const highExpenseCategories = transactions
    .filter((t) => t.transactionType === "EXPENSE")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  if (Object.keys(highExpenseCategories).length > 0) {
    recommendations.push("Review and optimize high-expense categories.");
  }

  return recommendations;
}
