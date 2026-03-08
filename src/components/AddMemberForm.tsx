import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface AddMemberFormProps {
  onAdd: (name: string) => void;
}

export function AddMemberForm({ onAdd }: AddMemberFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Member name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="sm" className="gap-1.5">
        <UserPlus className="h-4 w-4" />
        Add
      </Button>
    </form>
  );
}
