import { useRef, useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import jsPDF from "jspdf";
import topbar from "topbar";
import "nprogress/nprogress.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ImportExportButtons({
  onImport,
}: {
  onImport?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle file import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    topbar.show();
    try {
      const res = await fetch(`${apiUrl}/api/transactions/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to import transactions");
      setImportSuccess("Transactions imported!");
      if (onImport) onImport();
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      topbar.hide();
    }
  };

  // Handle export CSV or TXT
  const handleExport = async (type: "csv" | "txt") => {
    setExportError(null);
    topbar.show();
    try {
      const res = await fetch(`${apiUrl}/api/transactions/download`);
      if (!res.ok) throw new Error("Failed to export transactions");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "csv" ? "transactions.csv" : "transactions.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      topbar.hide();
    }
  };

  // Handle export PDF
  const handleExportPDF = async () => {
    setExportError(null);
    topbar.show();
    try {
      // Fetch CSV data and parse for summary
      const res = await fetch(`${apiUrl}/api/transactions/download`);
      if (!res.ok) throw new Error("Failed to export transactions");
      const text = await res.text();
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",");
      const rows = lines.slice(1).map((line) => line.split(","));
      // Calculate summary
      let totalIncome = 0,
        totalExpense = 0;
      rows.forEach((row) => {
        const amount = parseFloat(row[0]);
        const category = row[1];
        if (isNaN(amount)) return; // skip invalid rows
        if (category === "SALARY" || category === "BUSINESS")
          totalIncome += amount;
        else totalExpense += amount;
      });
      // Create PDF
      const doc = new jsPDF();
      doc.setFont("Poppins", "normal");
      doc.setFontSize(18);
      doc.text("Transaction Summary", 14, 18);
      doc.setFontSize(12);
      doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`, 14, 30);
      doc.text(`Total Expense: ₹${totalExpense.toFixed(2)}`, 14, 38);
      doc.text(`Net: ₹${(totalIncome - totalExpense).toFixed(2)}`, 14, 46);
      doc.setFontSize(14);
      doc.text("Transactions:", 14, 60);
      doc.setFontSize(10);
      // Table header
      let y = 68;
      doc.text(headers.join("  |  "), 14, y);
      y += 6;
      // Table rows (no limit, but chunk if needed for performance)
      const maxRowsPerPage = 40;
      let rowCount = 0;
      rows.forEach((row, i) => {
        doc.text(row.join("  |  "), 14, y);
        y += 6;
        rowCount++;
        // Add new page if too many rows for one page
        if (rowCount % maxRowsPerPage === 0 && i < rows.length - 1) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save("transactions.pdf");
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      topbar.hide();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto bg-">
      <div>
        <input
          type="file"
          accept=".csv,.txt"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="import-file-input"
        />
        <label htmlFor="import-file-input">
          <span className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg inline-flex items-center gap-2  text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wide shadow-lg cursor-pointer hover:scale-105 hover:shadow-green-300/40 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300/40">
            <ArrowUpTrayIcon className="w-5 h-5" /> Import CSV/Text
          </span>
        </label>
        {importError && <div className="text-red-500 mt-1">{importError}</div>}
        {importSuccess && (
          <div className="text-green-600 mt-1">{importSuccess}</div>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
          className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg inline-flex items-center gap-2  text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wide shadow-lg hover:scale-105 hover:shadow-blue-300/40 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300/40"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          EXPORT
          <ChevronRightIcon className="w-5 h-5 ml-2" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-50 rounded-xl shadow-lg z-50 border border-gray-200 overflow-hidden animate-fade-in-up">
            <button
              onClick={() => {
                setDropdownOpen(false);
                handleExport("csv");
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 text-[#EC4899] ibold flex items-center gap-2"
            >
              CSV
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false);
                handleExport("txt");
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 text-[#EC4899] font-semibold flex items-center gap-2"
            >
              Text
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false);
                handleExportPDF();
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 text-[#EC4899] ibold flex items-center gap-2"
            >
              PDF
            </button>
          </div>
        )}
        {exportError && <div className="text-red-500 mt-1">{exportError}</div>}
      </div>
    </div>
  );
}
