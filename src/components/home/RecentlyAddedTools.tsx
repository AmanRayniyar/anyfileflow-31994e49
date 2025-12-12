import { memo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Clock } from "lucide-react";
import { tools } from "@/data/tools";

// Recently added tools (simulated - in production, use created_at from database)
const recentlyAddedIds = [
  "frequency-detector", "watermark-image", "countdown-timer", "stopwatch",
  "pomodoro-timer", "qr-scanner", "pdf-protect", "pdf-unlocker"
];

const RecentlyAddedTools = memo(() => {
  const recentTools = recentlyAddedIds
    .map(id => tools.find(t => t.id === id))
    .filter(Boolean)
    .slice(0, 8);

  return (
    <section className="py-10 bg-secondary/30" aria-labelledby="new-tools-heading">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-500/10" aria-hidden="true">
              <Sparkles className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 id="new-tools-heading" className="text-xl font-bold text-foreground flex items-center gap-2">
                Recently Added
                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full">NEW</span>
              </h2>
              <p className="text-sm text-muted-foreground">Fresh tools just for you</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {recentTools.map((tool, index) => {
            if (!tool) return null;
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="group bg-card border border-border rounded-xl p-4 hover:border-green-500/50 hover:shadow-md transition-all relative overflow-hidden"
                aria-label={`${tool.name} - new tool`}
              >
                {index < 2 && (
                  <div className="absolute top-0 right-0 w-16 h-16">
                    <div className="absolute transform rotate-45 bg-green-500 text-white text-[8px] font-bold py-0.5 right-[-30px] top-[12px] w-[100px] text-center">
                      NEW
                    </div>
                  </div>
                )}
                
                <div className="w-10 h-10 mb-3 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Icon className="h-5 w-5 text-green-500" aria-hidden="true" />
                </div>
                
                <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-green-500 transition-colors truncate">
                  {tool.name.replace(' Converter', '').replace(' Tool', '')}
                </h3>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {tool.description}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <span>{index < 3 ? 'Added today' : `${index + 1} days ago`}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
});

RecentlyAddedTools.displayName = "RecentlyAddedTools";

export default RecentlyAddedTools;
