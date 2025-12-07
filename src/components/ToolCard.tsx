import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Tool, getCategoryById } from "@/data/tools";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const category = getCategoryById(tool.category);
  const Icon = tool.icon;

  return (
    <Link
      to={`/tool/${tool.id}`}
      className="group block tool-card-hover"
      aria-label={`${tool.name}: Convert ${tool.from} to ${tool.to}`}
    >
      <article className="bg-card border border-border rounded-xl p-5 h-full hover:border-primary/30 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-lg", category?.bgClass)} aria-hidden="true">
            <Icon className={cn("h-5 w-5", category?.colorClass)} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {tool.name}
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {tool.description}
            </p>
            <div className="flex items-center gap-2 mt-3" aria-label={`Converts ${tool.from} to ${tool.to}`}>
              <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
                {tool.from}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
                {tool.to}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ToolCard;