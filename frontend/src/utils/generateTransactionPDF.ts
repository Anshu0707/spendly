import jsPDF from "jspdf";

export async function generateTransactionPDF(apiUrl: string) {
  const res = await fetch(`${apiUrl}/api/transactions/download`);
  if (!res.ok) throw new Error("Failed to export transactions");
  const text = await res.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((line) => line.split(","));

  let totalIncome = 0, totalExpense = 0;
  rows.forEach((row) => {
    const amount = parseFloat(row[0]);
    const category = row[1];
    if (isNaN(amount)) return;
    if (category === "SALARY" || category === "BUSINESS") totalIncome += amount;
    else totalExpense += amount;
  });

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

  let y = 68;
  doc.text(headers.join("  |  "), 14, y);
  y += 6;

  const maxRowsPerPage = 40;
  let rowCount = 0;
  rows.forEach((row, i) => {
    doc.text(row.join("  |  "), 14, y);
    y += 6;
    rowCount++;
    if (rowCount % maxRowsPerPage === 0 && i < rows.length - 1) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("transactions.pdf");
}
