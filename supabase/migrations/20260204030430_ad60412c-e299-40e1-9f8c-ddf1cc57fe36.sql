-- Create admin_sessions table for persistent session storage
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  code_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index for fast token lookup
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(session_token);

-- Create index for cleanup of expired sessions
CREATE INDEX idx_admin_sessions_expires ON public.admin_sessions(expires_at);

-- Enable RLS (no public access - only edge function with service role can access)
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- No RLS policies needed - edge function uses service role to bypass RLS