import { useState, useRef, useEffect, useCallback } from "react";
import { Code, Upload, Github, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { detectLanguage } from "@/lib/language-detect";
import { sampleCodes } from "@/lib/sample-code";

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  context: string;
  onContextChange: (ctx: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const CodeInput = ({ code, onCodeChange, context, onContextChange, onGenerate, isGenerating }: CodeInputProps) => {
  const [language, setLanguage] = useState("Unknown");
  const [showContext, setShowContext] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [fetchingGithub, setFetchingGithub] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLanguage(detectLanguage(code)), 300);
    return () => clearTimeout(t);
  }, [code]);

  useEffect(() => {
    const saved = localStorage.getItem("autodoc-code");
    if (saved && !code) onCodeChange(saved);
  }, []);

  useEffect(() => {
    if (code) localStorage.setItem("autodoc-code", code);
  }, [code]);

  const lineCount = code.split("\n").length;
  const charCount = code.length;

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onCodeChange(e.target?.result as string);
    reader.readAsText(file);
  }, [onCodeChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const fetchGithub = async () => {
    if (!githubUrl) return;
    setFetchingGithub(true);
    try {
      let url = githubUrl;
      if (url.includes("github.com") && !url.includes("raw.githubusercontent")) {
        url = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      onCodeChange(text);
    } catch {
      // toast is handled at parent level
    } finally {
      setFetchingGithub(false);
    }
  };

  return (
    <div className="glass-strong p-5 flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Input Source</h2>
        {code && (
          <span className="text-xs font-mono px-2 py-1 rounded-md bg-primary/20 text-primary">
            {language}
          </span>
        )}
      </div>

      <Tabs defaultValue="paste" className="w-full">
        <TabsList className="w-full bg-secondary/50">
          <TabsTrigger value="paste" className="flex-1 gap-1.5 text-xs"><Code className="w-3 h-3" />Paste Code</TabsTrigger>
          <TabsTrigger value="upload" className="flex-1 gap-1.5 text-xs"><Upload className="w-3 h-3" />Upload</TabsTrigger>
          <TabsTrigger value="github" className="flex-1 gap-1.5 text-xs"><Github className="w-3 h-3" />GitHub</TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-3">
          <div className="relative rounded-lg border border-border bg-secondary/30 overflow-hidden">
            <div className="flex">
              <div className="py-3 px-2 text-right select-none border-r border-border min-w-[3rem]">
                {Array.from({ length: Math.max(lineCount, 10) }, (_, i) => (
                  <div key={i} className="text-xs text-muted-foreground/40 font-mono leading-5">{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                placeholder="Paste your code here..."
                className="flex-1 bg-transparent p-3 text-sm font-mono text-foreground resize-none focus:outline-none min-h-[280px] leading-5"
                spellCheck={false}
              />
            </div>
            <div className="flex justify-between items-center px-3 py-1.5 border-t border-border text-xs text-muted-foreground">
              <span>{lineCount} lines</span>
              <span>{charCount.toLocaleString()} chars</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
            }`}
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drop a file or click to upload</p>
            <p className="text-xs text-muted-foreground/60 mt-1">.js .ts .py .java .go .rs .rb .php .cs .cpp .c .jsx .tsx</p>
          </div>
          <input ref={fileRef} type="file" className="hidden" accept=".js,.ts,.py,.java,.go,.rs,.rb,.php,.cs,.cpp,.c,.jsx,.tsx,.vue,.swift,.kt" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </TabsContent>

        <TabsContent value="github" className="mt-3">
          <div className="flex gap-2">
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/user/repo/blob/main/file.js"
              className="flex-1 bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button onClick={fetchGithub} disabled={fetchingGithub || !githubUrl} size="sm" className="gradient-button">
              {fetchingGithub ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Context */}
      <button onClick={() => setShowContext(!showContext)} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
        {showContext ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        Additional Context (optional)
      </button>
      {showContext && (
        <textarea
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          placeholder="Describe what this project does, its purpose, or any special notes..."
          className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
        />
      )}

      {/* Generate button */}
      <Button
        onClick={onGenerate}
        disabled={!code.trim() || isGenerating}
        className={`w-full py-6 text-base font-semibold transition-all ${
          code.trim() && !isGenerating ? "gradient-button animate-pulse-glow" : "bg-secondary text-muted-foreground"
        }`}
      >
        {isGenerating ? (
          <><Loader2 className="w-5 h-5 animate-spin mr-2" />Analyzing with AI...</>
        ) : (
          <><Sparkles className="w-5 h-5 mr-2" />Generate Documentation</>
        )}
      </Button>

      {/* Example cards */}
      {!code && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Try an example:</p>
          <div className="grid gap-2">
            {sampleCodes.map((s) => (
              <button
                key={s.title}
                onClick={() => onCodeChange(s.code)}
                className="glass text-left p-3 hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono">{s.language}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{s.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeInput;
