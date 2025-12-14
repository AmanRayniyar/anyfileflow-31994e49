import { Link } from "react-router-dom";
import { Tool, getCategoryById } from "@/data/tools";
import { cn } from "@/lib/utils";
import { memo } from "react";

// Inline SVG Arrow
const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = memo(({ tool }: ToolCardProps) => {
  const category = getCategoryById(tool.category);

  return (
    <Link
      to={`/tool/${tool.id}`}
      className="group block tool-card-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
      aria-label={`${tool.name}: Convert ${tool.from} to ${tool.to}`}
    >
      <article className="bg-card border border-border rounded-xl p-5 h-full hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-lg shrink-0 flex items-center justify-center", category?.bgClass)}>
            <span className={cn("text-sm font-bold", category?.colorClass)}>{tool.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1 gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {tool.name}
              </h3>
              <ArrowIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md text-secondary-foreground">{tool.from}</span>
              <ArrowIcon className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md text-secondary-foreground">{tool.to}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
});

ToolCard.displayName = "ToolCard";

export default ToolCard;
