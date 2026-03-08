import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddMemberForm } from "@/components/AddMemberForm";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { BalanceSummary } from "@/components/BalanceSummary";
import { SettlementList } from "@/components/SettlementList";
import { ExpenseList } from "@/components/ExpenseList";
import { computeBalances, simplifyDebts } from "@/lib/expenses";
import { Trash2, X, Wallet } from "lucide-react";
import type { Member, Expense } from "@/lib/expenses";

const Index = () => {
  const [groupName, setGroupName] = useState("My Group");
  const [isEditingName, setIsEditingName] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const balances = useMemo(() => computeBalances(members, expenses), [members, expenses]);
  const settlements = useMemo(() => simplifyDebts(members, expenses), [members, expenses]);
  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const addMember = (name: string) => {
    if (members.some((m) => m.name.toLowerCase() === name.toLowerCase())) return;
    setMembers((prev) => [...prev, { id: crypto.randomUUID(), name }]);
  };

  const removeMember = (id: string) => {
    if (expenses.some((e) => e.paidBy === id || e.splitAmong.includes(id))) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addExpense = (title: string, amount: number, paidBy: string, splitAmong: string[]) => {
    setExpenses((prev) => [
      { id: crypto.randomUUID(), title, amount, paidBy, splitAmong, createdAt: new Date() },
      ...prev,
    ]);
  };

  const clearAll = () => {
    setMembers([]);
    setExpenses([]);
    setGroupName("My Group");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl leading-tight">SettleUp</h1>
              {isEditingName ? (
                <input
                  autoFocus
                  className="text-xs text-muted-foreground bg-transparent border-b border-primary outline-none"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                />
              ) : (
                <button onClick={() => setIsEditingName(true)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {groupName} ✎
                </button>
              )}
            </div>
          </div>
          {(members.length > 0 || expenses.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-negative gap-1.5">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </header>

      <main className="container max-w-2xl py-6 space-y-6">
        {/* Stats row */}
        {members.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-card border p-4 text-center">
              <p className="text-2xl font-display font-bold">{members.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            <div className="rounded-xl bg-card border p-4 text-center">
              <p className="text-2xl font-display font-bold">{expenses.length}</p>
              <p className="text-xs text-muted-foreground">Expenses</p>
            </div>
            <div className="rounded-xl bg-card border p-4 text-center">
              <p className="text-2xl font-display font-bold">₹{totalSpent.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        )}

        {/* Members */}
        <section className="space-y-3">
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">Members</h2>
          <AddMemberForm onAdd={addMember} />
          {members.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <Badge key={m.id} variant="secondary" className="gap-1 pl-3 pr-1 py-1.5 text-sm">
                  {m.name}
                  <button
                    onClick={() => removeMember(m.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                    title={expenses.some((e) => e.paidBy === m.id || e.splitAmong.includes(m.id)) ? "Can't remove — part of expenses" : "Remove"}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </section>

        {/* Add Expense */}
        <AddExpenseForm members={members} onAdd={addExpense} />

        {/* Settlements & Balances */}
        {expenses.length > 0 && (
          <>
            <SettlementList members={members} settlements={settlements} />
            <BalanceSummary members={members} balances={balances} />
            <ExpenseList members={members} expenses={expenses} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
