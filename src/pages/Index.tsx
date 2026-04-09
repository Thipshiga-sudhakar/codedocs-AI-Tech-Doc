import { useState, useCallback } from "react";
import Header from "@/components/Header";
import CodeInput from "@/components/CodeInput";
import DocsOutput from "@/components/DocsOutput";
import SettingsModal from "@/components/SettingsModal";
import HistoryDrawer from "@/components/HistoryDrawer";
import HeroParticles from "@/components/HeroParticles";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { GeneratedDocs, DocSettings, HistoryItem } from "@/lib/types";

const defaultSettings: DocSettings = {
  depth: "standard",
  includeExamples: true,
  includeDiagrams: true,
  includePatterns: true,
  includeComplexity: true,
  outputLanguage: "English",
};

const Index = () => {
  const [code, setCode] = useState("");
  const [context, setContext] = useState("");
  const [docs, setDocs] = useState<GeneratedDocs | null>(null);
  const [tokenUsage, setTokenUsage] = useState<{ input: number; output: number } | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<DocSettings>(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("autodoc-history") || "[]");
    } catch { return []; }
  });

  const generate = useCallback(async () => {
    if (!code.trim()) return;
    setIsGenerating(true);
    setDocs(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-docs", {
        body: { code, context, settings },
      });

      if (error) throw new Error(error.message || "Failed to generate documentation");

      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (data.error.includes("Payment")) {
          toast.error("AI credits exhausted. Please add funds in Settings → Workspace → Usage.");
        } else {
          toast.error(data.error);
        }
        return;
      }

      const generated = data.docs as GeneratedDocs;
      setDocs(generated);
      setTokenUsage(data.tokenUsage);

      // Save to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        projectName: generated.projectName,
        language: generated.language,
        timestamp: Date.now(),
        docs: generated,
        code,
      };
      const newHistory = [newItem, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("autodoc-history", JSON.stringify(newHistory));

      toast.success("Documentation generated successfully!");
    } catch (err: any) {
      console.error("Generation error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [code, context, settings, history]);

  const handleHistorySelect = (item: HistoryItem) => {
    setCode(item.code);
    setDocs(item.docs);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <HeroParticles />
      <div className="relative z-10">
        <Header onHistoryToggle={() => setHistoryOpen(true)} onSettingsOpen={() => setSettingsOpen(true)} />

        {/* Skeleton loading */}
        {isGenerating && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div />
              <div className="glass-strong p-5 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-4 bg-secondary rounded w-1/3" />
                    <div className="h-20 bg-secondary rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className={`grid gap-6 ${docs ? "lg:grid-cols-2" : "max-w-2xl mx-auto"}`}>
            <CodeInput
              code={code}
              onCodeChange={setCode}
              context={context}
              onContextChange={setContext}
              onGenerate={generate}
              isGenerating={isGenerating}
            />
            {docs && <DocsOutput docs={docs} tokenUsage={tokenUsage} />}
          </div>
        </main>
      </div>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} settings={settings} onSettingsChange={setSettings} />
      <HistoryDrawer open={historyOpen} onOpenChange={setHistoryOpen} items={history} onSelect={handleHistorySelect} />
    </div>
  );
};

export default Index;
