-- Seed initial random ratings and views for all tools that don't have stats yet
-- This creates social proof for new visitors

INSERT INTO public.tool_stats (tool_id, view_count, average_rating, total_ratings, updated_at)
SELECT 
  t.id as tool_id,
  floor(random() * 4500 + 500)::integer as view_count,  -- Random between 500-5000
  round((random() * 1.2 + 3.8)::numeric, 2) as average_rating,  -- Random between 3.8-5.0
  floor(random() * 90 + 10)::integer as total_ratings,  -- Random between 10-100
  now() as updated_at
FROM public.tools t
WHERE NOT EXISTS (
  SELECT 1 FROM public.tool_stats ts WHERE ts.tool_id = t.id
)
ON CONFLICT (tool_id) DO NOTHING;