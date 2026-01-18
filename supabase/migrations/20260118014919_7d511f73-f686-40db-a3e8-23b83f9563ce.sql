
-- Update the trigger function to preserve boosted stats and add real ratings on top
CREATE OR REPLACE FUNCTION public.update_tool_rating_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_avg numeric;
  current_total integer;
  new_avg numeric;
BEGIN
  -- Get current stats (including boosted values)
  SELECT average_rating, total_ratings
  INTO current_avg, current_total
  FROM public.tool_stats
  WHERE tool_id = NEW.tool_id;

  -- If no existing stats, create new entry with just the new rating
  IF current_avg IS NULL THEN
    INSERT INTO public.tool_stats (tool_id, total_ratings, average_rating, updated_at)
    VALUES (NEW.tool_id, 1, NEW.rating, now());
  ELSE
    -- Calculate new weighted average: ((old_avg * old_total) + new_rating) / (old_total + 1)
    new_avg := ROUND(((current_avg * current_total) + NEW.rating) / (current_total + 1), 2);
    
    -- Update stats by adding to existing totals (preserves boost)
    UPDATE public.tool_stats
    SET 
      total_ratings = current_total + 1,
      average_rating = new_avg,
      updated_at = now()
    WHERE tool_id = NEW.tool_id;
  END IF;

  RETURN NEW;
END;
$function$;
