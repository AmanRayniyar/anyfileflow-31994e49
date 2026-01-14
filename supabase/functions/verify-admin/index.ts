import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Session storage for admin tokens (in-memory, expires on function restart or after TTL)
const adminSessions = new Map<string, { codeType: string; createdAt: number }>();
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

// Clean up expired sessions
function cleanupSessions() {
  const now = Date.now();
  for (const [token, session] of adminSessions) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      adminSessions.delete(token);
    }
  }
}

// Generate a secure random token
async function generateToken(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { code, codeType, action, sessionToken } = body;

    // Handle session validation
    if (action === 'validate-session') {
      cleanupSessions();

      if (!sessionToken) {
        return new Response(
          JSON.stringify({ valid: false, error: 'Session token required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const session = adminSessions.get(sessionToken);
      if (!session) {
        return new Response(
          JSON.stringify({ valid: false, error: 'Invalid or expired session' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if session is expired
      if (Date.now() - session.createdAt > SESSION_TTL_MS) {
        adminSessions.delete(sessionToken);
        return new Response(
          JSON.stringify({ valid: false, error: 'Session expired' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ valid: true, codeType: session.codeType }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle logout
    if (action === 'logout') {
      if (sessionToken) {
        adminSessions.delete(sessionToken);
      }
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Admin-only blog operations (bypass RLS using service role) ---
    if (action && action.startsWith('blog-')) {
      cleanupSessions();

      if (!sessionToken) {
        return new Response(
          JSON.stringify({ success: false, error: 'Session token required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const session = adminSessions.get(sessionToken);
      if (!session || Date.now() - session.createdAt > SESSION_TTL_MS) {
        if (session) adminSessions.delete(sessionToken);
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid or expired session' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const canManageBlog = session.codeType === 'blog' || session.codeType === 'master';
      if (!canManageBlog) {
        return new Response(
          JSON.stringify({ success: false, error: 'Insufficient permissions' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      if (action === 'blog-list') {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('blog-list error:', error);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to fetch blog posts' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, posts: data ?? [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'blog-create') {
        const post = body.post;
        if (!post?.title || !post?.slug || !post?.excerpt || !post?.content || !post?.category) {
          return new Response(
            JSON.stringify({ success: false, error: 'Missing required fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            image: post.image ?? null,
            author: post.author ?? 'Aman Rauniyar',
            category: post.category,
            tags: Array.isArray(post.tags) ? post.tags : [],
            published: post.published !== undefined ? !!post.published : true,
          })
          .select('*')
          .single();

        if (error) {
          console.error('blog-create error:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, post: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'blog-update') {
        const { id, updates } = body;
        if (!id || !updates) {
          return new Response(
            JSON.stringify({ success: false, error: 'id and updates are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .update({
            title: updates.title,
            slug: updates.slug,
            excerpt: updates.excerpt,
            content: updates.content,
            image: updates.image,
            author: updates.author,
            category: updates.category,
            tags: updates.tags,
            published: updates.published,
          })
          .eq('id', id)
          .select('*')
          .single();

        if (error) {
          console.error('blog-update error:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, post: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'blog-delete') {
        const { id } = body;
        if (!id) {
          return new Response(
            JSON.stringify({ success: false, error: 'id is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) {
          console.error('blog-delete error:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Unknown action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle login verification
    if (!code || !codeType) {
      console.log('Missing code or codeType');
      return new Response(
        JSON.stringify({ valid: false, error: 'Code and code type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying admin code for type: ${codeType}`);

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Hash the provided code for comparison
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedCode = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('Looking up admin code in database...');

    // Check if the hashed code matches any admin code of the specified type
    const { data: adminCode, error } = await supabase
      .from('admin_codes')
      .select('id')
      .eq('hashed_code', hashedCode)
      .eq('code_type', codeType)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ valid: false, error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isValid = !!adminCode;
    console.log(`Verification result: ${isValid ? 'valid' : 'invalid'}`);

    if (isValid) {
      // Generate session token and store it server-side
      cleanupSessions();
      const token = await generateToken();
      adminSessions.set(token, { codeType, createdAt: Date.now() });

      return new Response(
        JSON.stringify({ valid: true, sessionToken: token }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ valid: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in verify-admin function:', error);
    return new Response(
      JSON.stringify({ valid: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

