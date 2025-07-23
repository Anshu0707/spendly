// src/types/transaction.ts
export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: string; 
  amount: number;
  category: string;
  categoryType?: string;
  date: string;
  transactionType: TransactionType;
};
