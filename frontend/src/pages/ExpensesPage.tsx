import { useEffect, useState } from "react";
import { ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  TruckIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { GiHamburger } from "react-icons/gi";

const apiUrl = import.meta.env.VITE_API_URL;

export type Transaction = {
  id?: number;
  amount: number;
  transactionType: string;
  category: string;
  categoryType?: string;
  date: string;
};

function getCategoryIcon(category: string) {
  switch (category.toUpperCase()) {
    case "SALARY":
      return <span className="text-green-400 text-lg">💰</span>;
    case "BUSINESS":
      return <BriefcaseIcon className="w-6 h-6 text-blue-400" />;
    case "RENT":
      return <BuildingOffice2Icon className="w-6 h-6 text-yellow-400" />;
    case "TRAVEL":
      return <TruckIcon className="w-6 h-6 text-purple-400" />;
    case "FOOD":
      return <GiHamburger color="#fde047" size={24} />; // Tailwind yellow-300
    default:
      return <QuestionMarkCircleIcon className="w-6 h-6 text-gray-400" />;
  }
}

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/transactions`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then((data) => {
        setTransactions(
          data.filter((tx: Transaction) => tx.transactionType === "EXPENSE")
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full px-4 pt-3 pb-4 h-screen flex flex-col overflow-hidden">
      <h2 className="text-3xl font-bold mb-3 text-white flex items-center gap-3">
        <ArrowTrendingDownIcon className="w-8 h-8 text-pink-400" /> Expenses
      </h2>
      {loading ? (
        <div className="text-center text-gray-300 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No expense transactions found.
        </div>
      ) : (
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden pr-2 max-h-[calc(100vh-120px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Fixed Header Row */}
          <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6 mb-0">
            <div className="flex items-center justify-between w-full text-gray-300 font-semibold">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <span>Category</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-center w-[120px]">Amount</span>
                <span className="text-center w-[110px]">Date</span>
              </div>
            </div>
          </div>
          <ul className="flex flex-col gap-0 w-full max-w-none">
            {transactions.map((tx, idx) => (
              <li
                key={idx}
                className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-pink-500/20 p-6 flex flex-col md:flex-row md:items-center md:justify-between shadow-2xl break-words w-full shadow-white/10"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {getCategoryIcon(tx.category)}
                    </div>
                    <span className="text-gray-300 font-medium">
                      {tx.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-lg font-semibold text-pink-300 text-center w-[120px]">
                      ₹{tx.amount.toFixed(2)}
                    </span>
                    <span className="text-gray-400 text-sm text-center w-[110px]">
                      {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
