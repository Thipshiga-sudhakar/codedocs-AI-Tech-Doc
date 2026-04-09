import { useState } from "react";
import ReactMarkdown from "react-markdown";
import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Download, Eye, Code } from "lucide-react";

const ReadmeTab = ({ readme }: { readme: string }) => {
  const [view, setView] = useState<"preview" | "raw">("preview");

  const downloadReadme = () => {
    const blob = new Blob([readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-0.5">
          <button
            onClick={() => setView("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
          <button
            onClick={() => setView("raw")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === "raw" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="w-3 h-3" /> Raw
          </button>
        </div>
        <div className="flex gap-2">
          <CopyButton text={readme} />
          <Button variant="outline" size="sm" onClick={downloadReadme} className="text-xs gap-1.5">
            <Download className="w-3 h-3" /> Download
          </Button>
        </div>
      </div>

      <div className="glass p-6 overflow-auto max-h-[600px]">
        {view === "preview" ? (
          <div className="prose-docs">
            <ReactMarkdown>{readme}</ReactMarkdown>
          </div>
        ) : (
          <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">{readme}</pre>
        )}
      </div>
    </div>
  );
};

export default ReadmeTab;
