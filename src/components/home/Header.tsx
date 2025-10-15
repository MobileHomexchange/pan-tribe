import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <div className="bg-card rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Tribe Pulse</h1>
      </div>
    </div>
  );
}
