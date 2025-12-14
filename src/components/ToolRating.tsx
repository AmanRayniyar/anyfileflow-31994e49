import { memo, useState } from "react";
import { Star, Eye, ThumbsUp } from "lucide-react";
import { useToolStats } from "@/hooks/useToolStats";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ToolRatingProps {
  toolId: string;
  toolName: string;
}

const ToolRating = memo(({ toolId, toolName }: ToolRatingProps) => {
  const { stats, userRating, loading, submitting, submitRating } = useToolStats(toolId);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRating = async (rating: number) => {
    if (submitting) return;
    
    const success = await submitRating(rating);
    if (success) {
      toast.success(`Thanks for rating ${toolName}!`, {
        description: `You gave it ${rating} star${rating > 1 ? 's' : ''}`
      });
    } else {
      toast.error("Failed to submit rating", {
        description: "Please try again later"
      });
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const displayRating = hoverRating ?? userRating ?? 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Rating Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">
              Rate this Tool
            </h3>
            {userRating && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full">
                <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                Rated
              </span>
            )}
          </div>
          
          {/* Star Rating Input */}
          <div className="flex items-center gap-1" role="group" aria-label="Rate this tool">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                disabled={submitting}
                className={cn(
                  "p-1 transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center",
                  "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
                  submitting && "opacity-50 cursor-not-allowed"
                )}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 transition-colors",
                    star <= displayRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted hover:text-yellow-400"
                  )}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
          
          {/* Rating Summary */}
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            {stats.averageRating > 0 ? (
              <>
                <span className="font-medium text-foreground">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span>({formatCount(stats.totalRatings)} rating{stats.totalRatings !== 1 ? 's' : ''})</span>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">(Early Access Rating)</span>
                </div>
                <span className="text-xs text-primary">⭐ Be the first to rate this tool — takes 2 seconds</span>
              </div>
            )}
          </div>
        </div>

        {/* View Count Section */}
        <div className="flex items-center gap-3 sm:border-l sm:border-border sm:pl-6">
          <div className="p-3 rounded-full bg-primary/10">
            <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {loading ? "..." : formatCount(stats.viewCount)}
            </p>
            <p className="text-xs text-muted-foreground">Total Views</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ToolRating.displayName = "ToolRating";

export default ToolRating;
