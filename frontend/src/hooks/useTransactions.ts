// src/hooks/useTransactions.ts
import { useContext } from "react";
import { TransactionContext } from "@/contexts/TransactionContext";
import type { TransactionContextType } from "@/contexts/TransactionContext";

export function useTransactions(): TransactionContextType {
  const ctx = useContext(TransactionContext);

  if (!ctx) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }

  return ctx;
}
