import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Member, Settlement } from "@/lib/expenses";

interface SettlementListProps {
  members: Member[];
  settlements: Settlement[];
}

export function SettlementList({ members, settlements }: SettlementListProps) {
  const getName = (id: string) => members.find((m) => m.id === id)?.name ?? id;

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Simplified Settlements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {settlements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No debts to settle — everyone is even! 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {settlements.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-card border animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-negative">{getName(s.from)}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-positive">{getName(s.to)}</span>
                </div>
                <span className="font-display font-bold text-foreground">₹{s.amount.toFixed(2)}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Only {settlements.length} transaction{settlements.length !== 1 ? "s" : ""} needed to settle all debts
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
