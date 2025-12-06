import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbTool {
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
}

export function useToolsAdmin() {
  const [tools, setTools] = useState<DbTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    setLoading(true);
    try {
      // Admin users with proper authentication will see all tools
      // due to the "Admins can read all tools" RLS policy
      // Non-authenticated requests will only see enabled tools
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setTools(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const updateTool = async (id: string, updates: Partial<DbTool>) => {
    try {
      const { error } = await supabase
        .from("tools")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, ...updates } : tool
      ));
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Update failed" };
    }
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    return updateTool(id, { enabled });
  };

  const togglePopular = async (id: string, popular: boolean) => {
    return updateTool(id, { popular });
  };

  return {
    tools,
    loading,
    error,
    fetchTools,
    updateTool,
    toggleEnabled,
    togglePopular
  };
}
