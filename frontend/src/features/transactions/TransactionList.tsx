import { useEffect, useState } from "react";
export type { Transaction };
const apiUrl = import.meta.env.VITE_API_URL;

type Transaction = {
  id?: number;
  amount: number;
  transactionType: string;
  category: string;
  categoryType?: string;
  date: string;
};

export default function TransactionList({
  onData,
}: {
  onData?: (txs: Transaction[]) => void;
}) {
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
        setTransactions(data);
        if (onData) onData(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [onData]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="w-full flex-grow overflow-x-hidden">
      <div className="bg-gradient-to-br from-white/90 via-violet-100/80 to-pink-100/80 shadow-2xl rounded-3xl p-4 md:p-6 backdrop-blur-md border border-violet-100/60 w-full h-full flex flex-col">
        <div className="relative w-full overflow-x-hidden">
          {/* Fixed Header */}
          <table className="w-full bg-transparent table-fixed mb-2">
            <thead>
              <tr>
                <th className="px-2 py-2 w-[100px]">
                  <span className="inline-block rounded-full bg-gradient-to-r from-violet-500 via-pink-400 to-orange-400 text-white font-extrabold uppercase tracking-wider text-left shadow-md px-3 py-1 whitespace-nowrap text-xs mr-8">
                    Amount
                  </span>
                </th>
                <th className="px-2 py-2 w-[100px]">
                  <span className="inline-block rounded-full bg-gradient-to-r from-violet-500 via-pink-400 to-orange-400 text-white font-extrabold uppercase tracking-wider text-left shadow-md px-3 py-1 whitespace-nowrap text-xs mr-8">
                    Type
                  </span>
                </th>
                <th className="px-2 py-2 w-[120px]">
                  <span className="inline-block rounded-full bg-gradient-to-r from-violet-500 via-pink-400 to-orange-400 text-white font-extrabold uppercase tracking-wider text-left shadow-md px-3 py-1 whitespace-nowrap text-xs mr-8">
                    Category
                  </span>
                </th>
                <th className="px-2 py-2 w-[100px]">
                  <span className="inline-block rounded-full bg-gradient-to-r from-violet-500 via-pink-400 to-orange-400 text-white font-extrabold uppercase tracking-wider text-left shadow-md px-3 py-1 whitespace-nowrap text-xs mr-8">
                    Date
                  </span>
                </th>
              </tr>
            </thead>
          </table>

          {/* Scrollable Body */}
          <div className="overflow-y-auto overflow-x-hidden max-h-[390px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full bg-transparent table-fixed">
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => (
                    <tr
                      key={idx}
                      className={`transition-all duration-200 ${
                        idx % 2 === 0
                          ? "bg-white/80 hover:bg-violet-50/80"
                          : "bg-violet-50/60 hover:bg-pink-50/80"
                      } hover:scale-[1.015] shadow-sm rounded-xl`}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="px-2 py-3 border-b text-gray-900 font-medium w-[100px]">
                        {tx.amount}
                      </td>
                      <td className="px-2 py-3 border-b w-[100px]">
                        <span
                          className={
                            tx.transactionType === "INCOME"
                              ? "inline-block px-3 py-1 rounded-full bg-gradient-to-r from-violet-400 to-pink-300 text-white text-xs font-semibold shadow"
                              : "inline-block px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 text-white text-xs font-semibold shadow"
                          }
                        >
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className="px-2 py-3 border-b text-gray-800 font-semibold w-[120px]">
                        {tx.category}
                      </td>
                      <td className="px-2 py-3 border-b text-gray-700 w-[100px]">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
