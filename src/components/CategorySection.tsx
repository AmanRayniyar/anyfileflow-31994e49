import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CategoryInfo, getToolsByCategory } from "@/data/tools";
import ToolCard from "./ToolCard";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  category: CategoryInfo;
  limit?: number;
}

const CategorySection = ({ category, limit = 6 }: CategorySectionProps) => {
  const tools = getToolsByCategory(category.id).slice(0, limit);
  const Icon = category.icon;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-lg", category.bgClass)}>
            <Icon className={cn("h-5 w-5", category.colorClass)} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        </div>
        <Link
          to={`/tools?category=${category.id}`}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      <Link
        to={`/tools?category=${category.id}`}
        className="flex sm:hidden items-center justify-center gap-1 mt-4 text-sm font-medium text-primary hover:underline"
      >
        View all {category.name.toLowerCase()}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
};

export default CategorySection;