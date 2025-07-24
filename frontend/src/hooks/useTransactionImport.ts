import { useRef, useState } from "react";
import topbar from "topbar";

export function useTransactionImport(apiUrl: string, onImport?: () => void) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
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
      setSuccess("Transactions imported!");
      onImport?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      fileInputRef.current!.value = "";
      topbar.hide();
    }
  };

  return { fileInputRef, handleFileChange, error, success };
}
