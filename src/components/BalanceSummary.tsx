import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";
import type { Member } from "@/lib/expenses";

interface BalanceSummaryProps {
  members: Member[];
  balances: Map<string, number>;
}

export function BalanceSummary({ members, balances }: BalanceSummaryProps) {
  if (members.length === 0) return null;

  const getName = (id: string) => members.find((m) => m.id === id)?.name ?? id;

  const sorted = [...balances.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Balances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sorted.map(([id, balance]) => (
          <div
            key={id}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50"
          >
            <span className="font-medium text-sm">{getName(id)}</span>
            <span className={`flex items-center gap-1 text-sm font-semibold ${
              balance > 0.01
                ? "text-positive"
                : balance < -0.01
                ? "text-negative"
                : "text-muted-foreground"
            }`}>
              {balance > 0.01 && <TrendingUp className="h-3.5 w-3.5" />}
              {balance < -0.01 && <TrendingDown className="h-3.5 w-3.5" />}
              {balance > 0.01
                ? `gets back ₹${balance.toFixed(2)}`
                : balance < -0.01
                ? `owes ₹${(-balance).toFixed(2)}`
                : "settled up"}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
