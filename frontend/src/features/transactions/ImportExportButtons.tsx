import { useRef, useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

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

  // Handle file import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
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
    }
  };

  // Handle export
  const handleExport = async () => {
    setExportError(null);
    try {
      const res = await fetch(`${apiUrl}/api/transactions/download`);
      if (!res.ok) throw new Error("Failed to export transactions");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-xl mx-auto">
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
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-400 to-lime-400 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wide shadow-lg cursor-pointer hover:scale-105 hover:shadow-green-300/40 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300/40">
            <ArrowUpTrayIcon className="w-5 h-5" /> Import CSV/Text
          </span>
        </label>
        {importError && <div className="text-red-500 mt-1">{importError}</div>}
        {importSuccess && (
          <div className="text-green-600 mt-1">{importSuccess}</div>
        )}
      </div>
      <div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-violet-400 to-pink-400 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wide shadow-lg hover:scale-105 hover:shadow-blue-300/40 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300/40"
        >
          <ArrowDownTrayIcon className="w-5 h-5" /> Export CSV
        </button>
        {exportError && <div className="text-red-500 mt-1">{exportError}</div>}
      </div>
    </div>
  );
}
