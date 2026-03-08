import { Receipt } from "lucide-react";
import { MemberAvatar } from "@/components/MemberAvatar";
import type { Member, Expense } from "@/lib/expenses";

interface ExpenseListProps {
  members: Member[];
  expenses: Expense[];
}

export function ExpenseList({ members, expenses }: ExpenseListProps) {
  const getName = (id: string) => members.find((m) => m.id === id)?.name ?? id;

  if (expenses.length === 0) return null;

  return (
    <div className="rounded-2xl glass shadow-soft overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-display font-bold text-sm">Expenses</h3>
        </div>
        <span className="text-xs text-muted-foreground font-medium">{expenses.length} total</span>
      </div>
      <div className="px-5 pb-5 space-y-2">
        {expenses.map((exp, i) => (
          <div
            key={exp.id}
            className="flex items-center gap-3 py-3 px-3 rounded-xl bg-background border animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <MemberAvatar name={getName(exp.paidBy)} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{exp.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Paid by <span className="font-semibold text-foreground">{getName(exp.paidBy)}</span>
                {" · "}split {exp.splitAmong.length} way{exp.splitAmong.length > 1 ? "s" : ""}
              </p>
            </div>
            <span className="font-display font-extrabold text-sm shrink-0">₹{exp.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
