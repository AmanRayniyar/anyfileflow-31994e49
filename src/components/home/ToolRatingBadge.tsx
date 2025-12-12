import { memo } from "react";
import { Star } from "lucide-react";

interface ToolRatingBadgeProps {
  rating?: number;
  reviews?: number;
  size?: "sm" | "md";
}

const ToolRatingBadge = memo(({ rating = 4.8, reviews = 1200, size = "sm" }: ToolRatingBadgeProps) => {
  const stars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={`flex items-center gap-1 ${size === "sm" ? "text-xs" : "text-sm"}`}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} ${
              i < stars
                ? "fill-yellow-400 text-yellow-400"
                : i === stars && hasHalfStar
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-muted"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-muted-foreground">
        {rating.toFixed(1)} ({reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}k` : reviews})
      </span>
    </div>
  );
});

ToolRatingBadge.displayName = "ToolRatingBadge";

export default ToolRatingBadge;
