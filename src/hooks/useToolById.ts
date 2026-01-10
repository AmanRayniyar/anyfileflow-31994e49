import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tool } from "@/data/tools";
import { dbRowToTool } from "@/hooks/useAllEnabledTools";

type DbToolRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  from_type: string;
  to_type: string;
  popular: boolean;
  enabled: boolean;
  tool_type: string;
  custom_content: string | null;
};

export function useToolById(toolId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!toolId) {
        setTool(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("tools")
          .select("id,name,description,category,icon,from_type,to_type,popular,enabled,tool_type,custom_content")
          .eq("id", toolId)
          .limit(1);

        if (error) throw error;

        const row = (data?.[0] ?? null) as DbToolRow | null;
        if (cancelled) return;
        setTool(row ? dbRowToTool(row) : null);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load tool");
        setTool(null);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [toolId]);

  return useMemo(() => ({ tool, loading, error }), [tool, loading, error]);
}
