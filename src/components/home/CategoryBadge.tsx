import { memo } from "react";
import { categories, ToolCategory } from "@/data/tools";

interface CategoryBadgeProps {
  category: ToolCategory;
  size?: "sm" | "md";
}

const CategoryBadge = memo(({ category, size = "sm" }: CategoryBadgeProps) => {
  const categoryInfo = categories.find(c => c.id === category);
  if (!categoryInfo) return null;

  const Icon = categoryInfo.icon;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
        size === "sm" 
          ? "px-2 py-0.5 text-xs" 
          : "px-3 py-1 text-sm"
      } ${categoryInfo.bgClass} ${categoryInfo.colorClass}`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} aria-hidden="true" />
      {categoryInfo.name.split(' ')[0]}
    </span>
  );
});

CategoryBadge.displayName = "CategoryBadge";

export default CategoryBadge;
