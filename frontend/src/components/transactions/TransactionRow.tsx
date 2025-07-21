import type { Transaction } from "../../contexts/TransactionContext";
import { CategoryIcon } from "./CategoryIcon";

type TransactionRowProps = {
  transaction: Transaction;
  colorClass: string;
};

export function TransactionRow({
  transaction: tx,
  colorClass,
}: TransactionRowProps) {
  return (
    <li
      className={`bg-gradient-to-r from-gray-800/80 to-gray-900/80 border ${colorClass}/20 p-6 flex flex-col md:flex-row md:items-center md:justify-between shadow-2xl break-words w-full shadow-white/10`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 flex items-center justify-center">
            <CategoryIcon category={tx.category} />
          </div>
          <span className="text-gray-300 font-medium">{tx.category}</span>
        </div>
        <div className="flex items-center gap-8">
          <span
            className={`text-lg font-semibold ${
              tx.transactionType === "INCOME"
                ? "text-green-300"
                : "text-pink-300"
            } text-center w-[120px]`}
          >
            ₹{tx.amount.toFixed(2)}
          </span>
          <span className="text-gray-400 text-sm text-center w-[110px]">
            {new Date(tx.date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </li>
  );
}
