// src/utils/filterByPeriods.ts
import { subDays, subMonths, isAfter } from "date-fns";
import type { Transaction } from "@/types/transaction";

export function filterByPeriod(
  transactions: Transaction[],
  selectedPeriod: string
): Transaction[] {
  const now = new Date();
  let startDate: Date;

  switch (selectedPeriod) {
    case "week":
      startDate = subDays(now, 7);
      break;
    case "month":
      startDate = subDays(now, 30);
      break;
    case "quarter":
      startDate = subMonths(now, 4);
      break;
    case "year":
      startDate = subMonths(now, 12);
      break;
    default:
      return transactions;
  }

  return transactions.filter((tx) => isAfter(new Date(tx.date), startDate));
}
