import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { HistoryItem } from "@/lib/types";

interface HistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistoryDrawer = ({ open, onOpenChange, items, onSelect }: HistoryDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-card border-border w-80">
        <SheetHeader>
          <SheetTitle>Documentation History</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No history yet</p>
          )}
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { onSelect(item); onOpenChange(false); }}
              className="w-full text-left glass p-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono">{item.language}</span>
                <span className="text-sm font-medium text-foreground truncate">{item.projectName}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;
