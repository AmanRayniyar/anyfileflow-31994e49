import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ToolStats {
  viewCount: number;
  averageRating: number;
  totalRatings: number;
}

// Cache for individual tool stats
const statsCache = new Map<string, { data: ToolStats; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Generate a unique fingerprint for the user
const getUserFingerprint = (): string => {
  const stored = localStorage.getItem("user-fingerprint");
  if (stored) return stored;
  
  const fingerprint = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem("user-fingerprint", fingerprint);
  return fingerprint;
};

export function useToolStats(toolId: string) {
  const [stats, setStats] = useState<ToolStats>(() => {
    // Initialize from cache if available
    const cached = statsCache.get(toolId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    return { viewCount: 0, averageRating: 0, totalRatings: 0 };
  });
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(() => !statsCache.has(toolId));
  const [submitting, setSubmitting] = useState(false);
  const fetchedRef = useRef(false);

  // Fetch stats with caching
  const fetchStats = useCallback(async () => {
    // Check cache first
    const cached = statsCache.get(toolId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setStats(cached.data);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tool_stats")
        .select("view_count, average_rating, total_ratings")
        .eq("tool_id", toolId)
        .maybeSingle();

      if (!error && data) {
        const newStats = {
          viewCount: data.view_count || 0,
          averageRating: Number(data.average_rating) || 0,
          totalRatings: data.total_ratings || 0
        };
        statsCache.set(toolId, { data: newStats, timestamp: Date.now() });
        setStats(newStats);
      }
    } catch (err) {
      console.error("Error fetching tool stats:", err);
    } finally {
      setLoading(false);
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

  // Increment view count (fire and forget)
  const incrementView = useCallback(() => {
    const viewedKey = `viewed-${toolId}`;
    if (sessionStorage.getItem(viewedKey)) return;
    
    sessionStorage.setItem(viewedKey, "true");
    
    // Fire and forget - async call
    (async () => {
      try {
        await supabase.rpc("increment_tool_view", { p_tool_id: toolId });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [toolId]);

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
      // Invalidate cache and refetch
      statsCache.delete(toolId);
      await fetchStats();
      return true;
    } catch (err) {
      console.error("Error submitting rating:", err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Initial load - only once
  useEffect(() => {
    if (fetchedRef.current || !toolId) return;
    fetchedRef.current = true;

    // Start fetch immediately
    setLoading(true);
    Promise.all([fetchStats(), checkUserRating()]).finally(() => {
      setLoading(false);
      incrementView();
    });
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
