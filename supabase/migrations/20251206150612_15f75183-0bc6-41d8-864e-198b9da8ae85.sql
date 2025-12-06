-- Create admin_codes table for secure admin access
CREATE TABLE public.admin_codes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code_type TEXT NOT NULL UNIQUE,
    hashed_code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_codes ENABLE ROW LEVEL SECURITY;

-- Only allow edge functions to read (no direct client access for security)
CREATE POLICY "No direct access to admin codes"
ON public.admin_codes
FOR ALL
USING (false);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    author TEXT NOT NULL DEFAULT 'Aman Rauniyar',
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for blog posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Anyone can read published blog posts"
ON public.blog_posts
FOR SELECT
USING (published = true);

-- Create tools table for admin management
CREATE TABLE public.tools (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'RefreshCw',
    from_type TEXT NOT NULL,
    to_type TEXT NOT NULL,
    popular BOOLEAN NOT NULL DEFAULT false,
    tool_type TEXT NOT NULL DEFAULT 'text',
    enabled BOOLEAN NOT NULL DEFAULT true,
    custom_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for tools
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Public can read enabled tools
CREATE POLICY "Anyone can read enabled tools"
ON public.tools
FOR SELECT
USING (enabled = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_codes_updated_at
    BEFORE UPDATE ON public.admin_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON public.tools
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();