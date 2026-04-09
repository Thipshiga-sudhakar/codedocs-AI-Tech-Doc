import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Lightbulb, Network, Play, FileText, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ApiReferenceTab from "@/components/output/ApiReferenceTab";
import CodeExplanationTab from "@/components/output/CodeExplanationTab";
import ArchitectureTab from "@/components/output/ArchitectureTab";
import UsageExamplesTab from "@/components/output/UsageExamplesTab";
import ReadmeTab from "@/components/output/ReadmeTab";
import { toast } from "sonner";
import type { GeneratedDocs } from "@/lib/types";

const DocsOutput = ({ docs, tokenUsage }: { docs: GeneratedDocs; tokenUsage?: { input: number; output: number } }) => {
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(docs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docs.projectName}-docs.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as JSON");
  };

  const exportMarkdown = () => {
    const blob = new Blob([docs.readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docs.projectName}-README.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as Markdown");
  };

  const copyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(docs, null, 2));
    toast.success("Copied to clipboard");
  };

  return (
    <div className="glass-strong p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{docs.projectName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono">{docs.language}</span>
            {docs.techStack.slice(0, 3).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tokenUsage && (
            <span className="text-xs text-muted-foreground font-mono">
              {tokenUsage.input + tokenUsage.output} tokens
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Download className="w-3 h-3" /> Export <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportMarkdown}>Export as Markdown</DropdownMenuItem>
              <DropdownMenuItem onClick={exportJson}>Export as JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={copyAll}>Copy all to clipboard</DropdownMenuItem>
              <DropdownMenuItem disabled>Share Link (Coming soon)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="w-full bg-secondary/50 flex-wrap h-auto gap-0.5 p-1">
          <TabsTrigger value="api" className="gap-1.5 text-xs flex-1"><Code className="w-3 h-3" />API Reference</TabsTrigger>
          <TabsTrigger value="explain" className="gap-1.5 text-xs flex-1"><Lightbulb className="w-3 h-3" />Explanation</TabsTrigger>
          <TabsTrigger value="arch" className="gap-1.5 text-xs flex-1"><Network className="w-3 h-3" />Architecture</TabsTrigger>
          <TabsTrigger value="examples" className="gap-1.5 text-xs flex-1"><Play className="w-3 h-3" />Examples</TabsTrigger>
          <TabsTrigger value="readme" className="gap-1.5 text-xs flex-1"><FileText className="w-3 h-3" />README</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="mt-4">
          <ApiReferenceTab items={docs.apiReference} />
        </TabsContent>
        <TabsContent value="explain" className="mt-4">
          <CodeExplanationTab data={docs.codeExplanation} complexity={docs.complexity} />
        </TabsContent>
        <TabsContent value="arch" className="mt-4">
          <ArchitectureTab data={docs.architecture} techStack={docs.techStack} />
        </TabsContent>
        <TabsContent value="examples" className="mt-4">
          <UsageExamplesTab examples={docs.usageExamples} />
        </TabsContent>
        <TabsContent value="readme" className="mt-4">
          <ReadmeTab readme={docs.readme} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocsOutput;
