-- Drop the restrictive select policy
DROP POLICY IF EXISTS "Anyone can read enabled tools" ON public.tools;

-- Create a policy that allows anyone to read enabled tools
CREATE POLICY "Anyone can read enabled tools"
ON public.tools
FOR SELECT
USING (enabled = true);

-- Create a policy that allows admins to read ALL tools (including disabled)
CREATE POLICY "Admins can read all tools"
ON public.tools
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));