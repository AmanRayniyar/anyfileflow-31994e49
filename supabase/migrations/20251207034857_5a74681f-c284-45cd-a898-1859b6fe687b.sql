-- Create comments table for tool comments
CREATE TABLE public.tool_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    user_email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tool_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Anyone can read comments"
ON public.tool_comments
FOR SELECT
USING (true);

-- Authenticated users can insert their own comments
CREATE POLICY "Authenticated users can insert comments"
ON public.tool_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON public.tool_comments
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
ON public.tool_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_tool_comments_updated_at
BEFORE UPDATE ON public.tool_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();