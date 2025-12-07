-- Drop existing insert policy
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.tool_comments;

-- Make user_id nullable for anonymous comments
ALTER TABLE public.tool_comments ALTER COLUMN user_id DROP NOT NULL;

-- Allow anyone to insert comments (with captcha verification on frontend)
CREATE POLICY "Anyone can insert comments"
ON public.tool_comments
FOR INSERT
WITH CHECK (true);

-- Update delete policy to allow deletion by matching email
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.tool_comments;

-- Only allow deletion if user_id matches (for authenticated) or no deletion for anonymous
CREATE POLICY "Users can delete their own comments"
ON public.tool_comments
FOR DELETE
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Update update policy similarly
DROP POLICY IF EXISTS "Users can update their own comments" ON public.tool_comments;

CREATE POLICY "Users can update their own comments"
ON public.tool_comments
FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);