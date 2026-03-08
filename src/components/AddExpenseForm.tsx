import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Receipt } from "lucide-react";
import type { Member } from "@/lib/expenses";

interface AddExpenseFormProps {
  members: Member[];
  onAdd: (title: string, amount: number, paidBy: string, splitAmong: string[]) => void;
}

export function AddExpenseForm({ members, onAdd }: AddExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  const toggleMember = (id: string) => {
    setSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (splitAmong.length === members.length) {
      setSplitAmong([]);
    } else {
      setSplitAmong(members.map((m) => m.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0 || !paidBy || splitAmong.length === 0) return;
    onAdd(title.trim(), Math.round(parsedAmount * 100) / 100, paidBy, splitAmong);
    setTitle("");
    setAmount("");
    setPaidBy("");
    setSplitAmong([]);
  };

  if (members.length < 2) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-muted-foreground">
          <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
          Add at least 2 members to start adding expenses.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Description</Label>
              <Input id="title" placeholder="e.g. Dinner" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Who paid?</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Split among</Label>
              <button type="button" onClick={selectAll} className="text-xs text-primary hover:underline">
                {splitAmong.length === members.length ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox checked={splitAmong.includes(m.id)} onCheckedChange={() => toggleMember(m.id)} />
                  {m.name}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">Add Expense</Button>
        </form>
      </CardContent>
    </Card>
  );
}
