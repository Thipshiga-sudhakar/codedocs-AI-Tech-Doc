import type { CodeExplanation } from "@/lib/types";
import { Lightbulb, Layers, ArrowRight, Fingerprint, Gauge } from "lucide-react";

const CodeExplanationTab = ({ data, complexity }: { data: CodeExplanation; complexity: number }) => {
  return (
    <div className="space-y-4 animate-slide-up">
      {/* Overview */}
      <div className="glass p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Overview</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.overview}</p>
      </div>

      {/* Complexity */}
      <div className="glass p-4">
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Complexity Score</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${complexity * 10}%`,
                background: `linear-gradient(90deg, hsl(142 71% 45%), hsl(38 92% 50%), hsl(0 72% 51%))`,
              }}
            />
          </div>
          <span className="text-sm font-mono font-bold text-foreground">{complexity}/10</span>
        </div>
      </div>

      {/* Key Components */}
      <div className="glass p-4">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Key Components</h3>
        </div>
        <div className="space-y-3">
          {data.keyComponents.map((c, i) => (
            <div key={i} className="bg-secondary/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-semibold text-foreground">{c.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{c.role}</span>
              </div>
              <p className="text-xs text-muted-foreground">{c.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Flow */}
      <div className="glass p-4">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Data Flow</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.dataFlow}</p>
      </div>

      {/* Design Patterns */}
      {data.designPatterns.length > 0 && (
        <div className="glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <Fingerprint className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Design Patterns</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.designPatterns.map((p, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full bg-accent/15 text-accent font-medium">{p}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExplanationTab;
