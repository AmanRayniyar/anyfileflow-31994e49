import { getPopularTools } from "@/data/tools";
import ToolCard from "./ToolCard";
import { memo, useMemo } from "react";

// Inline SVG for performance
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PopularTools = memo(() => {
  const popularTools = useMemo(() => getPopularTools().slice(0, 8), []);

  return (
    <section className="py-12 bg-secondary/30" aria-labelledby="popular-tools-heading">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-lg bg-accent/10" aria-hidden="true">
            <SparklesIcon className="h-5 w-5 text-accent" />
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
