import { Sparkles } from "lucide-react";
import { getPopularTools } from "@/data/tools";
import ToolCard from "./ToolCard";
import { memo, useMemo } from "react";

const PopularTools = memo(() => {
  const popularTools = useMemo(() => getPopularTools().slice(0, 8), []);

  return (
    <section className="py-12 bg-secondary/30" aria-labelledby="popular-tools-heading">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-lg bg-tool-data/10" aria-hidden="true">
            <Sparkles className="h-5 w-5 text-tool-data" aria-hidden="true" />
          </div>
          <div>
            <h2 id="popular-tools-heading" className="text-2xl font-bold text-foreground">Popular Tools</h2>
            <p className="text-sm text-muted-foreground">Most used conversion tools by our users</p>
          </div>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0" role="list" aria-label="Popular tools list">
          {popularTools.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

PopularTools.displayName = "PopularTools";

export default PopularTools;