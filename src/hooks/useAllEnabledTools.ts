import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tool, ToolCategory } from "@/data/tools";
import { RefreshCw } from "lucide-react";

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

const PAGE_SIZE = 1000;

export function normalizeCategory(category: string): ToolCategory {
  const c = (category || "").toLowerCase().trim();

  if (c === "image" || c === "images" || c === "pdf" || c === "document" || c === "documents") return "image";
  if (c === "audio" || c === "music") return "audio";
  if (c === "video" || c === "videos") return "video";
  if (c === "text" || c === "writing") return "text";
  if (c === "health" || c === "fitness") return "health";
  if (c === "data" || c === "dev" || c === "code" || c === "developer") return "data";

  // Fuzzy mapping
  if (c.includes("audio")) return "audio";
  if (c.includes("video")) return "video";
  if (c.includes("health") || c.includes("fitness")) return "health";
  if (c.includes("text") || c.includes("write")) return "text";
  if (c.includes("image") || c.includes("pdf") || c.includes("doc")) return "image";

  return "data";
}

export function dbRowToTool(row: DbToolRow): Tool {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: normalizeCategory(row.category),
    // DB stores icon as string; until we map icon names -> components, use a safe default.
    icon: RefreshCw,
    from: row.from_type,
    to: row.to_type,
    popular: row.popular,
    toolType: (row.tool_type as Tool["toolType"]) ?? "data",
  };
}

export function useAllEnabledTools() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        let from = 0;
        const rows: DbToolRow[] = [];

        // Explicit pagination so we can safely scale beyond 1000
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { data, error } = await supabase
            .from("tools")
            .select("id,name,description,category,icon,from_type,to_type,popular,enabled,tool_type,custom_content")
            .eq("enabled", true)
            .order("category", { ascending: true })
            .order("name", { ascending: true })
            .range(from, from + PAGE_SIZE - 1);

          if (error) throw error;

          const page = (data ?? []) as DbToolRow[];
          rows.push(...page);

          if (page.length < PAGE_SIZE) break;
          from += PAGE_SIZE;
        }

        if (cancelled) return;
        setTools(rows.map(dbRowToTool));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load tools");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => ({ tools, loading, error }), [tools, loading, error]);
}
