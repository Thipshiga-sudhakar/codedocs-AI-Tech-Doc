import { Zap, History, Settings, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onHistoryToggle: () => void;
  onSettingsOpen: () => void;
}

const Header = ({ onHistoryToggle, onSettingsOpen }: HeaderProps) => {
  return (
    <header className="relative">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-button flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">AutoDoc AI</h1>
              <p className="text-xs text-muted-foreground">Code in → Docs out</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onHistoryToggle} className="text-muted-foreground hover:text-foreground">
            <History className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSettingsOpen} className="text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4" /></a>
          </Button>
        </div>
      </div>
      <div className="gradient-line" />
    </header>
  );
};

export default Header;
