import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import type { ApiRefItem } from "@/lib/types";

const typeColors: Record<string, string> = {
  function: "bg-primary/20 text-primary",
  class: "bg-accent/20 text-accent",
  endpoint: "bg-warning/20 text-warning",
  component: "bg-success/20 text-success",
};

const ApiReferenceTab = ({ items }: { items: ApiRefItem[] }) => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search functions..."
          className="w-full bg-secondary/30 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {filtered.map((item, i) => (
        <div key={i} className="glass p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type] || typeColors.function}`}>
                {item.type}
              </span>
              <span className="font-mono font-semibold text-foreground">{item.name}</span>
            </div>
            <CopyButton text={item.example} />
          </div>

          <code className="block text-xs font-mono text-accent bg-secondary/50 rounded px-3 py-2 overflow-x-auto">
            {item.signature}
          </code>

          <p className="text-sm text-muted-foreground">{item.description}</p>

          {item.params.length > 0 && (
            <div>
              <button
                onClick={() => setExpanded((p) => ({ ...p, [i]: !p[i] }))}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {expanded[i] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Parameters ({item.params.length})
              </button>
              {expanded[i] && (
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-border">
                        <th className="pb-1 pr-4">Name</th>
                        <th className="pb-1 pr-4">Type</th>
                        <th className="pb-1 pr-4">Required</th>
                        <th className="pb-1">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.params.map((p, j) => (
                        <tr key={j} className="border-b border-border/30">
                          <td className="py-1.5 pr-4 font-mono text-foreground">{p.name}</td>
                          <td className="py-1.5 pr-4 font-mono text-accent">{p.type}</td>
                          <td className="py-1.5 pr-4">{p.required ? "✓" : "—"}</td>
                          <td className="py-1.5 text-muted-foreground">{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {item.returns && (
            <div className="text-xs">
              <span className="text-muted-foreground">Returns: </span>
              <span className="font-mono text-accent">{item.returns}</span>
            </div>
          )}

          {item.example && (
            <div className="relative">
              <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                {item.example}
              </pre>
              <CopyButton text={item.example} className="absolute top-1 right-1" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApiReferenceTab;
