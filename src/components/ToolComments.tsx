import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { User, Session } from "@supabase/supabase-js";

interface Comment {
  id: string;
  tool_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  user_email: string;
  content: string;
  created_at: string;
}

interface ToolCommentsProps {
  toolId: string;
}

const ToolComments = ({ toolId }: ToolCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [toolId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("tool_comments")
        .select("*")
        .eq("tool_id", toolId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.href,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error("Failed to sign in with Google");
      console.error("Sign in error:", error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("tool_comments").insert({
        tool_id: toolId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        user_avatar: user.user_metadata?.avatar_url || null,
        user_email: user.email || "",
        content: newComment.trim(),
      });

      if (error) throw error;

      toast.success("Comment posted successfully!");
      setNewComment("");
      fetchComments();
    } catch (error: any) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("tool_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Comment deleted");
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 mt-6" aria-labelledby="comments-section">
      <div className="flex items-center justify-between mb-6">
        <h2 id="comments-section" className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </h2>
        
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(user.user_metadata?.full_name || user.email || "U")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={signInWithGoogle}
            className="flex items-center gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        )}
      </div>

      {/* Comment Input */}
      {user ? (
        <div className="mb-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(user.user_metadata?.full_name || user.email || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {newComment.length}/1000
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-secondary/50 rounded-xl text-center">
          <LogIn className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground mb-3">Sign in with Google to post a comment</p>
          <Button onClick={signInWithGoogle} className="flex items-center gap-2 mx-auto">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 bg-secondary/30 rounded-xl">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={comment.user_avatar || undefined} alt={comment.user_name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(comment.user_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-foreground truncate">
                      {comment.user_name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {user?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ToolComments;
