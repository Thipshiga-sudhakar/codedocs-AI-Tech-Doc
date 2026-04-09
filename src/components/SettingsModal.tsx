import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DocSettings } from "@/lib/types";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: DocSettings;
  onSettingsChange: (s: DocSettings) => void;
}

const SettingsModal = ({ open, onOpenChange, settings, onSettingsChange }: SettingsModalProps) => {
  const update = (key: keyof DocSettings, value: any) =>
    onSettingsChange({ ...settings, [key]: value });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Documentation Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-2">
          {/* Depth */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Documentation Depth</Label>
            <div className="flex gap-2">
              {(["quick", "standard", "comprehensive"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => update("depth", d)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                    settings.depth === d ? "gradient-button" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Include in Output</Label>
            {([
              ["includeExamples", "Usage Examples"],
              ["includeDiagrams", "Architecture Diagrams"],
              ["includePatterns", "Design Patterns"],
              ["includeComplexity", "Complexity Score"],
            ] as const).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{label}</span>
                <Switch checked={settings[key] as boolean} onCheckedChange={(v) => update(key, v)} />
              </div>
            ))}
          </div>

          {/* Language */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Output Language</Label>
            <Select value={settings.outputLanguage} onValueChange={(v) => update("outputLanguage", v)}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["English", "Spanish", "French", "German", "Japanese"].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
