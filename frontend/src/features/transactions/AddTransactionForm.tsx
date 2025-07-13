import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const apiUrl = import.meta.env.VITE_API_URL;

const CATEGORY_TYPE_OPTIONS = [
  { label: "Salary", value: "SALARY", type: "INCOME" },
  { label: "Business", value: "BUSINESS", type: "INCOME" },
  { label: "Food", value: "FOOD", type: "EXPENSE" },
  { label: "Rent", value: "RENT", type: "EXPENSE" },
  { label: "Travel", value: "TRAVEL", type: "EXPENSE" },
  { label: "Other", value: "OTHER", type: "EXPENSE" },
];

const initialForm = {
  amount: 0,
  transactionType: "INCOME",
  categoryType: "SALARY",
  date: new Date(),
};

export default function AddTransactionForm({
  onAdd,
  headerClassName,
  title,
}: {
  onAdd?: () => void;
  headerClassName?: string;
  title?: string;
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "transactionType") {
      const firstValid = CATEGORY_TYPE_OPTIONS.find(
        (opt) => opt.type === value
      );
      setForm((prev) => ({
        ...prev,
        transactionType: value,
        categoryType: firstValid ? firstValid.value : "OTHER",
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setForm((prev) => ({ ...prev, date: date || new Date() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Prepare payload for backend
      const payload = {
        amount: Number(form.amount),
        transactionType: form.transactionType,
        category: form.categoryType, // flat string
        categoryType: form.categoryType, // categoryType is INCOME or EXPENSE
        date:
          form.date instanceof Date
            ? form.date.toISOString().slice(0, 10)
            : form.date,
      };
      const res = await fetch(`${apiUrl}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add transaction");
      setSuccess("Transaction added!");
      setForm(initialForm);
      if (onAdd) onAdd();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-white/80 via-violet-100/70 to-pink-100/70 shadow-2xl rounded-3xl p-6 md:p-8 max-w-xl mx-auto mb-8 backdrop-blur-md border border-violet-100/60"
    >
      <h2
        className={
          headerClassName || "text-2xl font-bold mb-6 text-primary text-center"
        }
      >
        {title || "Add Transaction"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-pink-400 to-orange-400 uppercase tracking-wide drop-shadow-sm">
              Amount
            </label>
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full shadow-sm">
              Text
            </span>
          </div>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min={0.01}
            step={0.01}
            required
            className="w-full border border-violet-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900 placeholder-gray-400 shadow-md transition-all duration-200 focus:shadow-pink-200/60"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-pink-400 to-orange-400 uppercase tracking-wide drop-shadow-sm">
              Type
            </label>
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full shadow-sm">
              Dropdown
            </span>
          </div>
          <select
            name="transactionType"
            value={form.transactionType}
            onChange={handleChange}
            className="w-full border border-violet-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900 shadow-md transition-all duration-200 focus:shadow-pink-200/60"
            required
          >
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-pink-400 to-orange-400 uppercase tracking-wide drop-shadow-sm">
              Category
            </label>
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full shadow-sm">
              Dropdown
            </span>
          </div>
          <select
            name="categoryType"
            value={form.categoryType}
            onChange={handleChange}
            className="w-full border border-violet-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900 shadow-md transition-all duration-200 focus:shadow-pink-200/60"
            required
          >
            {CATEGORY_TYPE_OPTIONS.filter(
              (opt) => opt.type === form.transactionType
            ).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-pink-400 to-orange-400 uppercase tracking-wide drop-shadow-sm">
              Date
            </label>
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full shadow-sm">
              Date
            </span>
          </div>
          <DatePicker
            selected={form.date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full border border-violet-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900 shadow-md transition-all duration-200 focus:shadow-pink-200/60"
            wrapperClassName="w-full"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-8 w-full bg-gradient-to-r from-violet-500 via-pink-400 to-orange-400 text-white px-6 py-3 rounded-xl font-extrabold shadow-xl hover:scale-105 hover:shadow-pink-300/40 active:scale-95 transition-all duration-200 disabled:opacity-50 tracking-wider uppercase drop-shadow-md focus:outline-none focus:ring-4 focus:ring-pink-300/40"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Transaction"}
      </button>
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      {success && (
        <div className="text-green-600 mt-4 text-center">{success}</div>
      )}
    </form>
  );
}
