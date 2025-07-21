import { useState, useMemo } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function VisualiserPage() {
  const { transactions, loading, error } = useTransactions();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedChart, setSelectedChart] = useState("overview");

  // Data processing functions with useMemo - must be before loading check
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      switch (selectedPeriod) {
        case "week": {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return txDate >= weekAgo;
        }
        case "month": {
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return txDate >= monthAgo;
        }
        case "quarter": {
          const quarterAgo = new Date(now);
          quarterAgo.setMonth(now.getMonth() - 3);
          return txDate >= quarterAgo;
        }
        case "year": {
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          return txDate >= yearAgo;
        }
        default:
          return true;
      }
    });
  }, [transactions, selectedPeriod]);

  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyIncome = new Array(12).fill(0);
    const monthlyExpenses = new Array(12).fill(0);

    filteredTransactions.forEach((tx) => {
      const date = new Date(tx.date);
      const month = date.getMonth();
      if (tx.transactionType === "INCOME") {
        monthlyIncome[month] += Number(tx.amount);
      } else {
        monthlyExpenses[month] += Number(tx.amount);
      }
    });

    return { months, monthlyIncome, monthlyExpenses };
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    filteredTransactions.forEach((tx) => {
      if (tx.transactionType === "EXPENSE") {
        const current = categoryMap.get(tx.category) || 0;
        categoryMap.set(tx.category, current + Number(tx.amount));
      }
    });
    return Array.from(categoryMap.entries());
  }, [filteredTransactions]);

  const balanceData = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.transactionType === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = filteredTransactions
      .filter((t) => t.transactionType === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { income, expenses };
  }, [filteredTransactions]);

  const trendData = useMemo(() => {
    // For week view, show daily data
    if (selectedPeriod === "week") {
      const dailyData = new Map();
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyData.set(date.toISOString().slice(0, 10), {
          income: 0,
          expenses: 0,
        });
      }

      filteredTransactions.forEach((tx) => {
        const dateKey = tx.date;
        const current = dailyData.get(dateKey) || { income: 0, expenses: 0 };
        if (tx.transactionType === "INCOME") {
          current.income += Number(tx.amount);
        } else {
          current.expenses += Number(tx.amount);
        }
        dailyData.set(dateKey, current);
      });

      return Array.from(dailyData.entries());
    }

    // For other periods, show monthly data
    const monthlyData = new Map();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    filteredTransactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthKey = months[date.getMonth()];
      const current = monthlyData.get(monthKey) || { income: 0, expenses: 0 };

      if (tx.transactionType === "INCOME") {
        current.income += Number(tx.amount);
      } else {
        current.expenses += Number(tx.amount);
      }
      monthlyData.set(monthKey, current);
    });

    return Array.from(monthlyData.entries());
  }, [filteredTransactions, selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  // Chart configurations
  const lineChartData = {
    labels: monthlyData.months,
    datasets: [
      {
        label: "Income",
        data: monthlyData.monthlyIncome,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: monthlyData.monthlyExpenses,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: categoryData.map(([category]) => category),
    datasets: [
      {
        label: "Expenses by Category",
        data: categoryData.map(([, amount]) => amount),
        backgroundColor: [
          "rgba(147, 51, 234, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderColor: [
          "rgba(147, 51, 234, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(251, 146, 60, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(168, 85, 247, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [balanceData.income, balanceData.expenses],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["rgba(34, 197, 94, 1)", "rgba(239, 68, 68, 1)"],
        borderWidth: 3,
      },
    ],
  };

  const trendChartData = {
    labels: trendData.map(([date]) => {
      if (selectedPeriod === "week") {
        return new Date(date).toLocaleDateString();
      } else {
        return date; // month name
      }
    }),
    datasets: [
      {
        label: selectedPeriod === "week" ? "Daily Income" : "Monthly Income",
        data: trendData.map(([, data]) => data.income),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: false,
        tension: 0.4,
      },
      {
        label:
          selectedPeriod === "week" ? "Daily Expenses" : "Monthly Expenses",
        data: trendData.map(([, data]) => data.expenses),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#1f2937",
          font: {
            family: "Poppins",
            weight: "bold" as const,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(147, 51, 234, 0.5)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "Poppins",
          },
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "Poppins",
          },
        },
      },
    },
  };

  const totalIncome = balanceData.income;
  const totalExpenses = balanceData.expenses;
  const balance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto transaction-list-scroll my-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 mb-4">
          📊 Financial Analytics
        </h1>
        <p className="text-xl text-gray-300 font-medium">
          Discover insights, track trends, and master your finances
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-semibold uppercase tracking-wider">
                Total Income
              </p>
              <p className="text-2xl font-bold text-white">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/30 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-semibold uppercase tracking-wider">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-white">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💸</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">
                Balance
              </p>
              <p
                className={`text-2xl font-bold ${
                  balance >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ₹{balance.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">⚖️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                Savings Rate
              </p>
              <p className="text-2xl font-bold text-white">{savingsRate}%</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          { id: "overview", label: "Monthly Overview", icon: "📊" },
          { id: "categories", label: "Category Analysis", icon: "🏷️" },
          { id: "balance", label: "Income vs Expenses", icon: "⚖️" },
          { id: "trends", label: "Recent Trends", icon: "📈" },
        ].map((chart) => (
          <button
            key={chart.id}
            onClick={() => setSelectedChart(chart.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              selectedChart === chart.id
                ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg scale-105"
                : "bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105"
            }`}
          >
            <span className="mr-2">{chart.icon}</span>
            {chart.label}
          </button>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-8">
        {selectedChart === "overview" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              ly Income vs Expenses
            </h2>
            <div className="h-96 flex items-center justify-center">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {selectedChart === "categories" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              ly Expenses by Category
            </h2>
            <div className="h-96">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {selectedChart === "balance" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              ly Income vs Expenses Distribution
            </h2>
            <div className="flex justify-center">
              <div className="w-96 h-96">
                <Doughnut data={doughnutData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {selectedChart === "trends" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {selectedPeriod === "week"
                ? "Last 7 Days"
                : selectedPeriod.charAt(0).toUpperCase() +
                  selectedPeriod.slice(1)}
              ly Trends
            </h2>
            <div className="h-96">
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-violet-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-violet-500/30">
          <h3 className="text-xl font-bold text-white mb-4">💡 Key Insights</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              {totalIncome > totalExpenses
                ? "Great job! You're saving money."
                : "Consider reducing expenses to improve savings."}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              {categoryData.length > 0 &&
                `Your biggest expense category is ${categoryData[0][0]}.`}
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              {Number(savingsRate) > 20
                ? "Excellent savings rate!"
                : "Aim for at least 20% savings rate."}
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-white mb-4">
            🎯 Recommendations
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
              Track your spending patterns regularly
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
              Set monthly budget goals
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
              Review and optimize high-expense categories
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <span className="text-white font-semibold">Period:</span>
          {["week", "month", "quarter", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedPeriod === period
                  ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white"
                  : "text-gray-300 hover:bg-white/20"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
