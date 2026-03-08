import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListChecks } from "lucide-react";
import type { Member, Expense } from "@/lib/expenses";

interface ExpenseListProps {
  members: Member[];
  expenses: Expense[];
}

export function ExpenseList({ members, expenses }: ExpenseListProps) {
  const getName = (id: string) => members.find((m) => m.id === id)?.name ?? id;

  if (expenses.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Expenses ({expenses.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {expenses.map((exp) => (
          <div key={exp.id} className="flex items-start justify-between py-3 px-3 rounded-lg bg-secondary/50">
            <div className="space-y-1">
              <p className="font-medium text-sm">{exp.title}</p>
              <p className="text-xs text-muted-foreground">
                Paid by <span className="font-medium text-foreground">{getName(exp.paidBy)}</span>
              </p>
              <div className="flex flex-wrap gap-1">
                {exp.splitAmong.map((id) => (
                  <Badge key={id} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {getName(id)}
                  </Badge>
                ))}
              </div>
            </div>
            <span className="font-display font-bold text-sm">₹{exp.amount.toFixed(2)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
