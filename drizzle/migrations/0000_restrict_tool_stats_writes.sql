ALTER TABLE public.tool_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert stats" ON public.tool_stats;
DROP POLICY IF EXISTS "Anyone can update stats" ON public.tool_stats;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.tool_stats FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.tool_stats TO anon, authenticated;
GRANT ALL ON TABLE public.tool_stats TO service_role;

COMMENT ON TABLE public.tool_stats IS 'Public aggregate view and rating statistics. Direct visitor writes are denied; updates use the view-count function and rating trigger.';
COMMENT ON POLICY "Anyone can read stats" ON public.tool_stats IS 'Intentional public read access to aggregate tool statistics; no personal information or secrets are stored here.';