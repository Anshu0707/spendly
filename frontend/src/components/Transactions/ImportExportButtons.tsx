import { Upload, Download, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTransactionImport } from "@/hooks/useTransactionImport";
import { handleExportFile } from "@/hooks/useTransactionExport";
import { generateTransactionPDF } from "@/utils/generateTransactionPDF";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ImportExportButtons({
  onImport,
}: {
  onImport?: () => void;
}) {
  const {
    fileInputRef,
    handleFileChange,
    error: importError,
    success: importSuccess,
  } = useTransactionImport(apiUrl, onImport);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
      {/* Import */}
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
          <span className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wide shadow-lg inline-flex items-center gap-2 cursor-pointer hover:scale-105 hover:shadow-green-300/40 active:scale-95 transition-all duration-200 focus:ring-4 focus:ring-green-300/40">
            <Upload className="w-5 h-5" /> Import CSV/Text
          </span>
        </label>
        {importError && <div className="text-red-500 mt-1">{importError}</div>}
        {importSuccess && (
          <div className="text-green-600 mt-1">{importSuccess}</div>
        )}
      </div>

      {/* Export Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
          className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wide shadow-lg inline-flex items-center gap-2 hover:scale-105 hover:shadow-blue-300/40 active:scale-95 transition-all duration-200 focus:ring-4 focus:ring-blue-300/40"
        >
          <Download className="w-5 h-5" />
          EXPORT
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-50 rounded-xl shadow-lg z-50 border border-gray-200 overflow-hidden animate-fade-in-up">
            <button
              onClick={() => handleExportFile(apiUrl, "csv")}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 text-[#EC4899] font-semibold flex items-center gap-2"
            >
              CSV
            </button>
            <button
              onClick={() => handleExportFile(apiUrl, "txt")}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 text-[#EC4899] font-semibold flex items-center gap-2"
            >
              Text
            </button>
            <button
              onClick={() =>
                generateTransactionPDF(apiUrl).catch((err) =>
                  setExportError(err.message || "PDF generation failed")
                )
              }
              className="w-full text-left px-4 py-2 hover:bg-gray-200 text-[#EC4899] font-semibold flex items-center gap-2"
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
