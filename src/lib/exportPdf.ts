import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Member, Expense, Settlement } from "@/lib/expenses";
import { computeBalances, simplifyDebts } from "@/lib/expenses";

const getName = (members: Member[], id: string) =>
  members.find((m) => m.id === id)?.name ?? id;

export function exportGroupPdf(
  groupName: string,
  members: Member[],
  expenses: Expense[],
  balances: Map<string, number>,
  settlements: Settlement[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(groupName, pageWidth / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0);
  y += 6;

  // Summary line
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  doc.setFontSize(11);
  doc.text(`Members: ${members.length}  |  Expenses: ${expenses.length}  |  Total: ₹${totalSpent.toFixed(2)}`, pageWidth / 2, y, { align: "center" });
  y += 10;

  // Expenses table
  if (expenses.length > 0) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Expenses", 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [["Title", "Amount (₹)", "Paid By", "Split Among"]],
      body: expenses.map((e) => [
        e.title,
        e.amount.toFixed(2),
        getName(members, e.paidBy),
        e.splitAmong.map((id) => getName(members, id)).join(", "),
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [99, 102, 241] },
      alternateRowStyles: { fillColor: [245, 245, 255] },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // Balances table
  if (balances.size > 0) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Balances", 14, y);
    y += 2;

    const balanceRows = [...balances.entries()].map(([id, bal]) => [
      getName(members, id),
      bal > 0.01 ? `+₹${bal.toFixed(2)}` : bal < -0.01 ? `-₹${(-bal).toFixed(2)}` : "Settled",
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Member", "Balance"]],
      body: balanceRows,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [99, 102, 241] },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // Settlements table
  if (settlements.length > 0) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Settlements", 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [["From", "To", "Amount (₹)"]],
      body: settlements.map((s) => [
        getName(members, s.from),
        getName(members, s.to),
        s.amount.toFixed(2),
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [99, 102, 241] },
    });
  }

  doc.save(`${groupName.replace(/[^a-zA-Z0-9]/g, "_")}_expenses.pdf`);
}

export function exportExpensePdf(
  groupName: string,
  members: Member[],
  expense: Expense
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 30;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Expense Receipt", pageWidth / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(groupName, pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0);
  y += 14;

  const details = [
    ["Title", expense.title],
    ["Amount", `₹${expense.amount.toFixed(2)}`],
    ["Paid By", getName(members, expense.paidBy)],
    ["Split Among", expense.splitAmong.map((id) => getName(members, id)).join(", ")],
    ["Per Person", `₹${(expense.amount / expense.splitAmong.length).toFixed(2)}`],
    ["Date", new Date(expense.createdAt).toLocaleDateString()],
  ];

  autoTable(doc, {
    startY: y,
    body: details,
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40 },
    },
    theme: "plain",
  });

  doc.save(`${expense.title.replace(/[^a-zA-Z0-9]/g, "_")}_receipt.pdf`);
}
