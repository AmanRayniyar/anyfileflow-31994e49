import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CategoryInfo, getToolsByCategory } from "@/data/tools";
import ToolCard from "./ToolCard";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

interface CategorySectionProps {
  category: CategoryInfo;
  limit?: number;
}

const CategorySection = memo(({ category, limit }: CategorySectionProps) => {
  const allTools = useMemo(() => getToolsByCategory(category.id), [category.id]);
  const tools = useMemo(() => limit ? allTools.slice(0, limit) : allTools, [allTools, limit]);
  const Icon = category.icon;
  const showViewAll = limit && allTools.length > limit;

  const sectionId = `category-${category.id}`;
  
  return (
    <section className="py-8 content-visibility-auto" aria-labelledby={sectionId}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-lg", category.bgClass)} aria-hidden="true">
            <Icon className={cn("h-5 w-5", category.colorClass)} aria-hidden="true" />
          </div>
          <div>
            <h2 id={sectionId} className="text-xl font-bold text-foreground">{category.name}</h2>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        </div>
        {showViewAll && (
          <Link
            to={`/tools?category=${category.id}`}
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline focus:underline min-h-0 inline-touch-target"
            aria-label={`View all ${category.name}`}
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0" role="list" aria-label={`${category.name} tools`}>
        {tools.map((tool) => (
          <li key={tool.id}>
            <ToolCard tool={tool} />
          </li>
        ))}
      </ul>
      {showViewAll && (
        <Link
          to={`/tools?category=${category.id}`}
          className="flex sm:hidden items-center justify-center gap-1 mt-4 text-sm font-medium text-primary hover:underline focus:underline"
          aria-label={`View all ${category.name}`}
        >
          View all {category.name.toLowerCase()}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </section>
  );
});

CategorySection.displayName = "CategorySection";

export default CategorySection;