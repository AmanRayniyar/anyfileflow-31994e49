import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ToolStats {
  viewCount: number;
  averageRating: number;
  totalRatings: number;
}

// Generate a unique fingerprint for the user
const getUserFingerprint = (): string => {
  const stored = localStorage.getItem("user-fingerprint");
  if (stored) return stored;
  
  const fingerprint = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem("user-fingerprint", fingerprint);
  return fingerprint;
};

export function useToolStats(toolId: string) {
  const [stats, setStats] = useState<ToolStats>({
    viewCount: 0,
    averageRating: 0,
    totalRatings: 0
  });
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tool_stats")
        .select("view_count, average_rating, total_ratings")
        .eq("tool_id", toolId)
        .maybeSingle();

      if (!error && data) {
        setStats({
          viewCount: data.view_count || 0,
          averageRating: parseFloat(String(data.average_rating)) || 0,
          totalRatings: data.total_ratings || 0
        });
      }
    } catch (err) {
      console.error("Error fetching tool stats:", err);
    }
  }, [toolId]);

  // Check if user already rated
  const checkUserRating = useCallback(async () => {
    try {
      const fingerprint = getUserFingerprint();
      const { data, error } = await supabase
        .from("tool_ratings")
        .select("rating")
        .eq("tool_id", toolId)
        .eq("user_fingerprint", fingerprint)
        .maybeSingle();

      if (!error && data) {
        setUserRating(data.rating);
      }
    } catch (err) {
      console.error("Error checking user rating:", err);
    }
  }, [toolId]);

  // Increment view count
  const incrementView = useCallback(async () => {
    try {
      // Check if already viewed in this session
      const viewedKey = `viewed-${toolId}`;
      if (sessionStorage.getItem(viewedKey)) return;
      
      await supabase.rpc("increment_tool_view", { p_tool_id: toolId });
      sessionStorage.setItem(viewedKey, "true");
      
      // Refresh stats after increment
      await fetchStats();
    } catch (err) {
      console.error("Error incrementing view:", err);
    }
  }, [toolId, fetchStats]);

  // Submit rating
  const submitRating = async (rating: number): Promise<boolean> => {
    setSubmitting(true);
    try {
      const fingerprint = getUserFingerprint();
      
      const { error } = await supabase
        .from("tool_ratings")
        .upsert(
          {
            tool_id: toolId,
            rating,
            user_fingerprint: fingerprint
          },
          { onConflict: "tool_id,user_fingerprint" }
        );

      if (error) {
        console.error("Error submitting rating:", error);
        return false;
      }

      setUserRating(rating);
      await fetchStats();
      return true;
    } catch (err) {
      console.error("Error submitting rating:", err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), checkUserRating()]);
      setLoading(false);
      incrementView();
    };
    
    if (toolId) {
      init();
    }
  }, [toolId, fetchStats, checkUserRating, incrementView]);

  return {
    stats,
    userRating,
    loading,
    submitting,
    submitRating,
    refetchStats: fetchStats
  };
}
