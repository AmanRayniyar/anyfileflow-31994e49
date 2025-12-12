import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ToolStatsMap {
  [toolId: string]: {
    viewCount: number;
    averageRating: number;
    totalRatings: number;
  };
}

export function useAllToolStats() {
  const [statsMap, setStatsMap] = useState<ToolStatsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const { data, error } = await supabase
          .from("tool_stats")
          .select("tool_id, view_count, average_rating, total_ratings");

        if (!error && data) {
          const map: ToolStatsMap = {};
          data.forEach((item) => {
            map[item.tool_id] = {
              viewCount: item.view_count || 0,
              averageRating: parseFloat(String(item.average_rating)) || 0,
              totalRatings: item.total_ratings || 0
            };
          });
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

  const getStats = (toolId: string) => {
    return statsMap[toolId] || { viewCount: 0, averageRating: 0, totalRatings: 0 };
  };

  // Get trending tools (sorted by views)
  const trendingToolIds = useMemo(() => {
    return Object.entries(statsMap)
      .sort((a, b) => b[1].viewCount - a[1].viewCount)
      .slice(0, 8)
      .map(([toolId]) => toolId);
  }, [statsMap]);

  // Get top rated tools
  const topRatedToolIds = useMemo(() => {
    return Object.entries(statsMap)
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
