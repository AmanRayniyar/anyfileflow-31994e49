import { memo, useMemo } from "react";
import { Globe, Users, Eye, TrendingUp } from "lucide-react";
import { useAllToolStats } from "@/hooks/useAllToolStats";

const GlobalUsersCounter = memo(() => {
  const { statsMap, loading } = useAllToolStats();

  const totalViews = useMemo(() => {
    return Object.values(statsMap).reduce((sum, stat) => sum + stat.viewCount, 0);
  }, [statsMap]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M+";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K+";
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-full border border-primary/20 animate-pulse">
          <div className="w-8 h-8 bg-primary/20 rounded-full" />
          <div className="w-24 h-5 bg-primary/20 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-4">
      <div className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-background to-primary/10 rounded-full border border-primary/30 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 cursor-default">
        {/* Animated background glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        
        {/* Globe icon with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-30" />
          <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>

        {/* Stats content - single line format */}
        <div className="relative flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {formatNumber(totalViews)}
          </span>
          <span className="text-sm text-muted-foreground">users worldwide</span>
          <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live
          </span>
        </div>

      </div>
    </div>
  );
});

GlobalUsersCounter.displayName = "GlobalUsersCounter";

export default GlobalUsersCounter;
