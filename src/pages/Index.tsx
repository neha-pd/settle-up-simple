import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddMemberForm } from "@/components/AddMemberForm";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { BalanceSummary } from "@/components/BalanceSummary";
import { SettlementList } from "@/components/SettlementList";
import { ExpenseList } from "@/components/ExpenseList";
import { computeBalances, simplifyDebts } from "@/lib/expenses";
import { Trash2, X, Wallet, Plus, ChevronLeft, Users } from "lucide-react";
import type { Member, Expense } from "@/lib/expenses";

interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
}

const createGroup = (name: string): Group => ({
  id: crypto.randomUUID(),
  name,
  members: [],
  expenses: [],
});

const Index = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;

  const updateGroup = (updated: Partial<Group>) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === activeGroupId ? { ...g, ...updated } : g))
    );
  };

  const balances = useMemo(
    () => (activeGroup ? computeBalances(activeGroup.members, activeGroup.expenses) : new Map()),
    [activeGroup]
  );
  const settlements = useMemo(
    () => (activeGroup ? simplifyDebts(activeGroup.members, activeGroup.expenses) : []),
    [activeGroup]
  );
  const totalSpent = useMemo(
    () => (activeGroup?.expenses.reduce((sum, e) => sum + e.amount, 0) ?? 0),
    [activeGroup]
  );

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newGroupName.trim() || "New Group";
    const group = createGroup(name);
    setGroups((prev) => [...prev, group]);
    setActiveGroupId(group.id);
    setNewGroupName("");
  };

  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    if (activeGroupId === id) setActiveGroupId(null);
  };

  const addMember = (name: string) => {
    if (!activeGroup) return;
    if (activeGroup.members.some((m) => m.name.toLowerCase() === name.toLowerCase())) return;
    updateGroup({ members: [...activeGroup.members, { id: crypto.randomUUID(), name }] });
  };

  const removeMember = (id: string) => {
    if (!activeGroup) return;
    if (activeGroup.expenses.some((e) => e.paidBy === id || e.splitAmong.includes(id))) return;
    updateGroup({ members: activeGroup.members.filter((m) => m.id !== id) });
  };

  const addExpense = (title: string, amount: number, paidBy: string, splitAmong: string[]) => {
    if (!activeGroup) return;
    updateGroup({
      expenses: [
        { id: crypto.randomUUID(), title, amount, paidBy, splitAmong, createdAt: new Date() },
        ...activeGroup.expenses,
      ],
    });
  };

  const clearGroup = () => {
    if (!activeGroup) return;
    updateGroup({ members: [], expenses: [] });
  };

  // ─── Group List View ───
  if (!activeGroup) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container max-w-2xl py-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl">SettleUp</h1>
          </div>
        </header>

        <main className="container max-w-2xl py-6 space-y-6">
          <form onSubmit={handleCreateGroup} className="flex gap-2">
            <input
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Group name (e.g. Goa Trip)"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Button type="submit" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Group
            </Button>
          </form>

          {groups.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/40" />
              <p className="text-muted-foreground">Create your first group to start splitting expenses.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroupId(g.id)}
                  className="w-full text-left rounded-xl bg-card border p-4 hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold">{g.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {g.members.length} member{g.members.length !== 1 ? "s" : ""} · {g.expenses.length} expense{g.expenses.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        role="button"
                        onClick={(e) => { e.stopPropagation(); deleteGroup(g.id); }}
                        className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-negative/10 text-muted-foreground hover:text-negative transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </span>
                      <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ─── Active Group View ───
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setActiveGroupId(null)} className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-display font-bold text-xl leading-tight">SettleUp</h1>
              {isEditingName ? (
                <input
                  autoFocus
                  className="text-xs text-muted-foreground bg-transparent border-b border-primary outline-none"
                  value={activeGroup.name}
                  onChange={(e) => updateGroup({ name: e.target.value })}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                />
              ) : (
                <button onClick={() => setIsEditingName(true)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {activeGroup.name} ✎
                </button>
              )}
            </div>
          </div>
          {(activeGroup.members.length > 0 || activeGroup.expenses.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearGroup} className="text-muted-foreground hover:text-negative gap-1.5">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </header>

      <main className="container max-w-2xl py-6 space-y-6">
        {activeGroup.members.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-card border p-4 text-center">
              <p className="text-2xl font-display font-bold">{activeGroup.members.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            <div className="rounded-xl bg-card border p-4 text-center">
              <p className="text-2xl font-display font-bold">{activeGroup.expenses.length}</p>
              <p className="text-xs text-muted-foreground">Expenses</p>
            </div>
            <div className="rounded-xl bg-card border p-4 text-center">
              <p className="text-2xl font-display font-bold">₹{totalSpent.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        )}

        <section className="space-y-3">
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">Members</h2>
          <AddMemberForm onAdd={addMember} />
          {activeGroup.members.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeGroup.members.map((m) => (
                <Badge key={m.id} variant="secondary" className="gap-1 pl-3 pr-1 py-1.5 text-sm">
                  {m.name}
                  <button
                    onClick={() => removeMember(m.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                    title={activeGroup.expenses.some((e) => e.paidBy === m.id || e.splitAmong.includes(m.id)) ? "Can't remove — part of expenses" : "Remove"}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </section>

        <AddExpenseForm members={activeGroup.members} onAdd={addExpense} />

        {activeGroup.expenses.length > 0 && (
          <>
            <SettlementList members={activeGroup.members} settlements={settlements} />
            <BalanceSummary members={activeGroup.members} balances={balances} />
            <ExpenseList members={activeGroup.members} expenses={activeGroup.expenses} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
