import topbar from "topbar";

export async function handleExportFile(apiUrl: string, type: "csv" | "txt") {
  topbar.show();
  try {
    const res = await fetch(`${apiUrl}/api/transactions/download`);
    if (!res.ok) throw new Error("Failed to export transactions");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions.${type}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } finally {
    topbar.hide();
  }
}
