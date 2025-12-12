-- Create tool_ratings table for user ratings
CREATE TABLE public.tool_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  user_fingerprint text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate ratings from same user
CREATE UNIQUE INDEX tool_ratings_unique_user ON public.tool_ratings (tool_id, user_fingerprint);

-- Create tool_stats table for view counts and aggregated ratings
CREATE TABLE public.tool_stats (
  tool_id text NOT NULL PRIMARY KEY,
  view_count integer NOT NULL DEFAULT 0,
  total_ratings integer NOT NULL DEFAULT 0,
  average_rating numeric(3,2) NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tool_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for tool_ratings
CREATE POLICY "Anyone can insert ratings" ON public.tool_ratings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read ratings" ON public.tool_ratings
  FOR SELECT USING (true);

-- RLS policies for tool_stats
CREATE POLICY "Anyone can read stats" ON public.tool_stats
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert stats" ON public.tool_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update stats" ON public.tool_stats
  FOR UPDATE USING (true);

-- Function to update tool stats when a rating is added
CREATE OR REPLACE FUNCTION public.update_tool_rating_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating numeric;
  total_count integer;
BEGIN
  -- Calculate new average and count
  SELECT AVG(rating)::numeric(3,2), COUNT(*)
  INTO avg_rating, total_count
  FROM public.tool_ratings
  WHERE tool_id = NEW.tool_id;

  -- Upsert into tool_stats
  INSERT INTO public.tool_stats (tool_id, total_ratings, average_rating, updated_at)
  VALUES (NEW.tool_id, total_count, avg_rating, now())
  ON CONFLICT (tool_id)
  DO UPDATE SET
    total_ratings = total_count,
    average_rating = avg_rating,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Trigger to auto-update stats on new rating
CREATE TRIGGER on_tool_rating_insert
  AFTER INSERT ON public.tool_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tool_rating_stats();

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_tool_view(p_tool_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.tool_stats (tool_id, view_count, updated_at)
  VALUES (p_tool_id, 1, now())
  ON CONFLICT (tool_id)
  DO UPDATE SET
    view_count = tool_stats.view_count + 1,
    updated_at = now();
END;
$$;