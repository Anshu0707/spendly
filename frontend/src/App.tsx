import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VisualiserPage from "./pages/VisualiserPage";
import { TransactionProvider } from "./contexts/TransactionContext";
import TransactionsPage from "./pages/TransactionsPage";
import IncomePage from "./pages/IncomePage";
import ExpensesPage from "./pages/ExpensesPage";
import {
  HomeIcon,
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/income", label: "Income", icon: CurrencyDollarIcon },
    { to: "/expenses", label: "Expenses", icon: ArrowTrendingDownIcon },
    { to: "/visualiser", label: "Visualiser", icon: ChartBarIcon },
  ];
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-30">
      <div className="flex items-center h-16 px-6 text-2xl font-bold text-white tracking-wide border-b border-gray-800 gap-3">
        <BanknotesIcon className="w-8 h-8 text-green-400" />
        SpendWise
      </div>
      <div className="px-4 py-4">
        <div className="relative mb-6">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <nav className="flex flex-col gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
                location.pathname === to
                  ? "bg-violet-700 text-white"
                  : "text-gray-200 hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" /> {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 px-4 sm:px-8 overflow-y-auto transaction-list-scroll">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <TransactionProvider>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<TransactionsPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/visualiser" element={<VisualiserPage />} />
          </Routes>
        </DashboardLayout>
      </TransactionProvider>
    </Router>
  );
}

export default App;
