import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Flame, Clock, Star } from "lucide-react";
import { tools } from "@/data/tools";

// Simulated trending data (in real app, this would come from analytics)
const trendingToolIds = [
  "jpg-to-png", "image-compressor", "pdf-merger", "qr-generator", 
  "background-remover", "video-compressor", "speech-to-text", "typing-test"
];

const TrendingTools = memo(() => {
  const trendingTools = useMemo(() => 
    trendingToolIds
      .map(id => tools.find(t => t.id === id))
      .filter(Boolean)
      .slice(0, 8),
    []
  );

  return (
    <section className="py-10" aria-labelledby="trending-heading">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-orange-500/10" aria-hidden="true">
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 id="trending-heading" className="text-xl font-bold text-foreground flex items-center gap-2">
              Trending Now
              <Flame className="h-4 w-4 text-orange-500 animate-pulse" aria-hidden="true" />
            </h2>
            <p className="text-sm text-muted-foreground">Most searched tools this week</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trendingTools.map((tool, index) => {
            if (!tool) return null;
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="group flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-orange-500/50 hover:shadow-md transition-all"
                aria-label={`${tool.name} - trending tool`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Icon className="h-5 w-5 text-orange-500" aria-hidden="true" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate group-hover:text-orange-500 transition-colors">
                    {tool.name.replace(' Converter', '').replace(' Tool', '')}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    <span>4.{9 - index}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
});

TrendingTools.displayName = "TrendingTools";

export default TrendingTools;
