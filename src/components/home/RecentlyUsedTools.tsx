import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { History, ArrowRight, X } from "lucide-react";
import { tools } from "@/data/tools";

const STORAGE_KEY = "anyfile-recently-used";

export const addRecentlyUsed = (toolId: string) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let recent: string[] = stored ? JSON.parse(stored) : [];
    recent = [toolId, ...recent.filter(id => id !== toolId)].slice(0, 8);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch (e) {
    console.error("Failed to save recently used:", e);
  }
};

const RecentlyUsedTools = memo(() => {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recently used:", e);
    }
  }, []);

  const clearRecent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentIds([]);
  };

  const recentTools = recentIds
    .map(id => tools.find(t => t.id === id))
    .filter(Boolean)
    .slice(0, 6);

  if (recentTools.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="recent-heading">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10" aria-hidden="true">
              <History className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 id="recent-heading" className="text-lg font-bold text-foreground">
                Recently Used
              </h2>
              <p className="text-xs text-muted-foreground">Pick up where you left off</p>
            </div>
          </div>
          <button 
            onClick={clearRecent}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 min-h-[44px] min-w-[44px] justify-center"
            aria-label="Clear recently used tools"
          >
            <X className="h-3 w-3" aria-hidden="true" /> Clear
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {recentTools.map((tool) => {
            if (!tool) return null;
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg hover:border-purple-500/50 hover:shadow-sm transition-all shrink-0"
                aria-label={`Continue using ${tool.name}`}
              >
                <Icon className="h-4 w-4 text-purple-500" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {tool.name.replace(' Converter', '').replace(' Tool', '')}
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
});

RecentlyUsedTools.displayName = "RecentlyUsedTools";

export default RecentlyUsedTools;
