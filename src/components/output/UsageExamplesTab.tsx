import CopyButton from "@/components/CopyButton";
import type { UsageExample } from "@/lib/types";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const UsageExamplesTab = ({ examples }: { examples: UsageExample[] }) => {
  return (
    <div className="space-y-4 animate-slide-up">
      {examples.map((ex, i) => (
        <div key={i} className="glass p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{ex.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{ex.description}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-accent/20 text-accent font-mono">{ex.language}</span>
          </div>
          <div className="relative">
            <pre className="bg-secondary/50 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto">
              {ex.code}
            </pre>
            <CopyButton text={ex.code} className="absolute top-2 right-2" />
          </div>
          <Button variant="outline" size="sm" disabled className="text-xs gap-1.5 opacity-50">
            <Play className="w-3 h-3" /> Run in Sandbox
            <span className="text-muted-foreground ml-1">(Coming soon)</span>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default UsageExamplesTab;
