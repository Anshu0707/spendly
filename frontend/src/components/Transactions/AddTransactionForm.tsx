// src/components/Transactions/AddTransactionForm.tsx
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import DatePicker from "react-datepicker";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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
  headerClassName,
  title,
}: {
  headerClassName?: string;
  title?: string;
}) {
  const { refresh, fetchAllTransactions } = useTransactions();
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
      const payload = {
        amount: Number(form.amount),
        transactionType: form.transactionType,
        category: form.categoryType,
        categoryType: form.categoryType,
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
      refresh();
      fetchAllTransactions(); // Refresh full dataset for summary
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-gray-800 via-gray-900 to-black/80 border border-gray-700 rounded-xl shadow-xl p-6"
    >
      <h2
        className={
          headerClassName ||
          "text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-center drop-shadow"
        }
      >
        {title || "Add Transaction"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <FormField label="Amount" tag="Number">
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min={0.01}
            step={0.01}
            required
            className="input-style"
          />
        </FormField>

        <FormField label="Type" tag="Dropdown">
          <select
            name="transactionType"
            value={form.transactionType}
            onChange={handleChange}
            required
            className="input-style bg-[#1e1e2e] text-white"
          >
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
        </FormField>

        <FormField label="Category" tag="Dropdown">
          <select
            name="categoryType"
            value={form.categoryType}
            onChange={handleChange}
            required
            className="input-style bg-[#1e1e2e] text-white"
          >
            {CATEGORY_TYPE_OPTIONS.filter(
              (opt) => opt.type === form.transactionType
            ).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Date" tag="Calendar">
          <DatePicker
            selected={form.date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="input-style bg-[#1e1e2e] text-white"
            wrapperClassName="w-full"
            required
            popperClassName="z-50"
          />
        </FormField>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={loading}
        className="mt-16 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-500 px-6 py-3 rounded-xl font-bold text-white tracking-widest uppercase shadow-md hover:shadow-pink-500/30 transition-all duration-200 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Transaction"}
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      {success && (
        <p className="text-emerald-400 mt-4 text-center">{success}</p>
      )}
    </form>
  );
}

function FormField({
  label,
  tag,
  children,
}: {
  label: string;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="font-bold text-sm text-white/80 uppercase tracking-wide">
          {label}
        </label>
        <span className="text-xs bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-full px-2 py-1 font-semibold shadow-sm">
          {tag}
        </span>
      </div>
      {children}
    </div>
  );
}
