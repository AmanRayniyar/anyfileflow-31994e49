import { Sparkles } from "lucide-react";
import { getPopularTools } from "@/data/tools";
import ToolCard from "./ToolCard";

const PopularTools = () => {
  const popularTools = getPopularTools();

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-lg bg-tool-data/10">
            <Sparkles className="h-5 w-5 text-tool-data" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Popular Tools</h2>
            <p className="text-sm text-muted-foreground">Most used conversion tools by our users</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.slice(0, 8).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTools;