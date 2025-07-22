import AnimatedNumber from "../../ui/AnimatedNumber";
import { useTransactions } from "../../contexts/TransactionContext";

export default function TransactionSummary() {
  const { transactions, loading, error } = useTransactions();
  const income = transactions
    .filter((t) => t.transactionType === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions
    .filter((t) => t.transactionType === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expenses;

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center mb-10 animate-fade-in">
      <div className="w-40 h-40 bg-gradient-to-br from-violet-500/80 via-pink-400/70 to-orange-300/80 shadow-2xl backdrop-blur-md px-3 py-3 rounded-3xl text-center border-2 border-violet-200/80 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-pink-300/40 cursor-pointer animate-fade-in-up min-h-[10rem] min-w-[10rem]">
        <div className="flex flex-col items-center justify-center flex-1">
          <span className="mb-1 text-3xl text-green-500 drop-shadow-lg font-extrabold animate-bounce-slow">
            🟢
          </span>
          <div className="font-extrabold text-base tracking-wide uppercase text-gray-900 drop-shadow-sm min-h-[28px] flex items-center justify-center">
            Incomes
          </div>
          <div className="text-2xl font-extrabold text-green-600 drop-shadow-md mt-2 animate-pulse flex items-end justify-center min-h-[36px]">
            <AnimatedNumber value={income} />
          </div>
        </div>
      </div>
      <div className="w-40 h-40 bg-gradient-to-br from-pink-500/80 via-orange-300/70 to-yellow-200/80 shadow-2xl backdrop-blur-md px-3 py-3 rounded-3xl text-center border-2 border-pink-200/80 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-orange-300/40 cursor-pointer animate-fade-in-up min-h-[10rem] min-w-[10rem]">
        <div className="flex flex-col items-center justify-center flex-1">
          <span className="mb-1 text-3xl text-pink-500 drop-shadow-lg font-extrabold animate-bounce-slow">
            💸
          </span>
          <div className="font-extrabold text-base tracking-wide uppercase text-gray-900 drop-shadow-sm min-h-[28px] flex items-center justify-center">
            Expenses
          </div>
          <div className="text-2xl font-extrabold text-pink-600 drop-shadow-md mt-2 animate-pulse flex items-end justify-center min-h-[36px]">
            <AnimatedNumber value={expenses} />
          </div>
        </div>
      </div>
      <div className="w-40 h-40 bg-gradient-to-br from-blue-300/80 via-violet-400/70 to-pink-200/80 shadow-2xl backdrop-blur-md px-3 py-3 rounded-3xl text-center border-2 border-blue-200/80 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-violet-300/40 cursor-pointer animate-fade-in-up min-h-[10rem] min-w-[10rem]">
        <div className="flex flex-col items-center justify-center flex-1">
          <span className="mb-1 text-3xl text-blue-500 drop-shadow-lg font-extrabold animate-bounce-slow">
            🧮
          </span>
          <div className="font-extrabold text-base tracking-wide uppercase text-gray-900 drop-shadow-sm min-h-[28px] flex items-center justify-center">
            Balance
          </div>
          <div className="text-2xl font-extrabold text-blue-700 drop-shadow-md mt-2 animate-pulse flex items-end justify-center min-h-[36px]">
            <AnimatedNumber value={balance} />
          </div>
        </div>
      </div>
    </div>
  );
}
