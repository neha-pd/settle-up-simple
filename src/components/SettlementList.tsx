import { ArrowRight, Sparkles, PartyPopper } from "lucide-react";
import { MemberAvatar } from "@/components/MemberAvatar";
import type { Member, Settlement } from "@/lib/expenses";

interface SettlementListProps {
  members: Member[];
  settlements: Settlement[];
}

export function SettlementList({ members, settlements }: SettlementListProps) {
  const getName = (id: string) => members.find((m) => m.id === id)?.name ?? id;

  return (
    <div className="rounded-2xl glass shadow-soft overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-bold text-sm">Simplified Settlements</h3>
          <p className="text-[11px] text-muted-foreground">Minimum transactions to settle all debts</p>
        </div>
      </div>
      <div className="px-5 pb-5">
        {settlements.length === 0 ? (
          <div className="text-center py-6">
            <PartyPopper className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium text-foreground">All settled up!</p>
            <p className="text-xs text-muted-foreground">No debts to settle — everyone is even 🎉</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {settlements.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-background border animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-2">
                  <MemberAvatar name={getName(s.from)} size="sm" />
                  <span className="font-semibold text-sm text-negative">{getName(s.from)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mx-1" />
                  <MemberAvatar name={getName(s.to)} size="sm" />
                  <span className="font-semibold text-sm text-positive">{getName(s.to)}</span>
                </div>
                <span className="font-display font-extrabold text-sm">₹{s.amount.toFixed(2)}</span>
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground text-center pt-1 font-medium">
              Only {settlements.length} transaction{settlements.length !== 1 ? "s" : ""} needed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
