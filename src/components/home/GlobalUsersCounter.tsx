import { memo, useMemo } from "react";
import { useAllToolStats } from "@/hooks/useAllToolStats";

// Inline SVG for performance
const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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
      <div className="flex justify-center py-4" aria-busy="true">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
          <div className="w-8 h-8 bg-primary/20 rounded-full" />
          <div className="w-24 h-5 bg-primary/20 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-4">
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/30 shadow-lg shadow-primary/10 cursor-default">
        {/* Globe icon */}
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-lg">
          <GlobeIcon className="w-5 h-5 text-primary-foreground" />
        </div>

        {/* Stats content */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            {formatNumber(totalViews)}
          </span>
          <span className="text-sm text-muted-foreground">users worldwide</span>
          <span className="flex items-center gap-1 text-xs text-accent font-medium">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
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
