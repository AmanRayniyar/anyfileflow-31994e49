import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ToolStatsMap {
  [toolId: string]: {
    viewCount: number;
    averageRating: number;
    totalRatings: number;
  };
}

// Cache for stats to avoid refetching
let cachedStatsMap: ToolStatsMap | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export function useAllToolStats() {
  const [statsMap, setStatsMap] = useState<ToolStatsMap>(cachedStatsMap || {});
  const [loading, setLoading] = useState(!cachedStatsMap);

  useEffect(() => {
    // Use cached data if fresh
    if (cachedStatsMap && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setStatsMap(cachedStatsMap);
      setLoading(false);
      return;
    }

    const fetchAllStats = async () => {
      try {
        const { data, error } = await supabase
          .from("tool_stats")
          .select("tool_id, view_count, average_rating, total_ratings");

        if (!error && data) {
          const map: ToolStatsMap = {};
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            map[item.tool_id] = {
              viewCount: item.view_count || 0,
              averageRating: Number(item.average_rating) || 0,
              totalRatings: item.total_ratings || 0
            };
          }
          cachedStatsMap = map;
          cacheTimestamp = Date.now();
          setStatsMap(map);
        }
      } catch (err) {
        console.error("Error fetching all tool stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  const getStats = useCallback((toolId: string) => {
    return statsMap[toolId] || { viewCount: 0, averageRating: 0, totalRatings: 0 };
  }, [statsMap]);

  // Get trending tools (sorted by views) - memoized for performance
  const trendingToolIds = useMemo(() => {
    const entries = Object.entries(statsMap);
    if (entries.length === 0) return [];
    
    return entries
      .sort((a, b) => b[1].viewCount - a[1].viewCount)
      .slice(0, 8)
      .map(([toolId]) => toolId);
  }, [statsMap]);

  // Get top rated tools - memoized for performance
  const topRatedToolIds = useMemo(() => {
    const entries = Object.entries(statsMap);
    if (entries.length === 0) return [];
    
    return entries
      .filter(([_, stats]) => stats.totalRatings >= 1)
      .sort((a, b) => b[1].averageRating - a[1].averageRating)
      .slice(0, 6)
      .map(([toolId]) => toolId);
  }, [statsMap]);

  return {
    statsMap,
    loading,
    getStats,
    trendingToolIds,
    topRatedToolIds
  };
}
