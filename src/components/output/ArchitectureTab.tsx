import type { Architecture } from "@/lib/types";
import { Network, Layers, GitBranch } from "lucide-react";

const ArchitectureTab = ({ data, techStack }: { data: Architecture; techStack: string[] }) => {
  return (
    <div className="space-y-4 animate-slide-up">
      {/* Type */}
      <div className="glass p-4 flex items-center gap-3">
        <Network className="w-5 h-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Architecture Type</p>
          <p className="text-lg font-semibold text-foreground">{data.type}</p>
        </div>
      </div>

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <div className="glass p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((t, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border font-mono text-foreground">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Layers */}
      <div className="glass p-4">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">System Layers</h3>
        </div>
        <div className="space-y-2">
          {data.layers.map((layer, i) => (
            <div key={i} className="bg-secondary/30 rounded-lg p-3 border-l-2 border-primary">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">{layer.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{layer.responsibility}</p>
              <div className="flex flex-wrap gap-1.5">
                {layer.components.map((c, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dependencies */}
      {data.dependencies.length > 0 && (
        <div className="glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-foreground">Dependencies</h3>
          </div>
          <div className="space-y-2">
            {data.dependencies.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs flex-wrap">
                <span className="px-2 py-1 rounded bg-primary/20 text-primary font-mono">{d.from}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-muted-foreground italic flex-1">{d.reason}</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 rounded bg-accent/20 text-accent font-mono">{d.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagram */}
      {data.diagram && (
        <div className="glass p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Architecture Diagram</h3>
          <pre className="bg-secondary/50 rounded-lg p-4 text-xs font-mono text-accent overflow-x-auto whitespace-pre">
            {data.diagram}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ArchitectureTab;
