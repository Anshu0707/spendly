// src/utils/filterByPeriod.ts
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  isWithinInterval,
  parseISO,
} from "date-fns";
import type { Transaction } from "@/types/transaction";

export function filterByPeriod(
  transactions: Transaction[],
  selectedPeriod: string
): Transaction[] {
  const now = new Date();

  if (selectedPeriod === "All") {
    return transactions;
  }

  let start: Date, end: Date;

  switch (selectedPeriod) {
    case "Week":
      start = startOfWeek(now, { weekStartsOn: 1 }); // Monday–Sunday
      end = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case "Month":
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case "Quarter":
      start = startOfQuarter(now);
      end = endOfQuarter(now);
      break;
    case "Year":
      start = startOfYear(now);
      end = endOfYear(now);
      break;
    default:
      return transactions;
  }

  return transactions.filter((tx) =>
    isWithinInterval(parseISO(tx.date), { start, end })
  );
}
