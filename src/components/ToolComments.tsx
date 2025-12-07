import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  tool_id: string;
  user_id: string | null;
  user_name: string;
  user_avatar: string | null;
  user_email: string;
  content: string;
  created_at: string;
}

interface ToolCommentsProps {
  toolId: string;
}

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '×'] as const;
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer: number;
  switch (operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '×':
      answer = num1 * num2;
      break;
  }
  
  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer: answer.toString(),
  };
};

const ToolComments = ({ toolId }: ToolCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
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

  const handleSubmitComment = async () => {
    // Validate inputs
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!userEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // Verify captcha
    if (captchaInput.trim() !== captcha.answer) {
      toast.error("Incorrect captcha answer. Please try again.");
      refreshCaptcha();
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("tool_comments").insert({
        tool_id: toolId,
        user_id: null,
        user_name: userName.trim(),
        user_avatar: null,
        user_email: userEmail.trim(),
        content: newComment.trim(),
      });

      if (error) throw error;

      toast.success("Comment posted successfully!");
      setNewComment("");
      setCaptchaInput("");
      refreshCaptcha();
      fetchComments();
    } catch (error: any) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
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

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500/20 text-red-600",
      "bg-blue-500/20 text-blue-600",
      "bg-green-500/20 text-green-600",
      "bg-yellow-500/20 text-yellow-600",
      "bg-purple-500/20 text-purple-600",
      "bg-pink-500/20 text-pink-600",
      "bg-indigo-500/20 text-indigo-600",
      "bg-teal-500/20 text-teal-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 mt-6" aria-labelledby="comments-section">
      <h2 id="comments-section" className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <div className="mb-6 p-4 bg-secondary/30 rounded-xl">
        <h3 className="font-medium text-foreground mb-4">Leave a Comment</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Name *</Label>
            <Input
              id="userName"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email *</Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="your@email.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">Your email won't be displayed publicly</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <Label htmlFor="comment">Comment *</Label>
          <Textarea
            id="comment"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
            maxLength={1000}
          />
          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {newComment.length}/1000
            </span>
          </div>
        </div>

        {/* Captcha */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="captcha">Verify you're human *</Label>
            <div className="flex items-center gap-3">
              <div className="bg-background border border-border rounded-lg px-4 py-2 font-mono text-lg select-none">
                {captcha.question}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={refreshCaptcha}
                className="shrink-0"
                title="Refresh captcha"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Input
                id="captcha"
                placeholder="Answer"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-24"
                maxLength={5}
              />
            </div>
          </div>
          
          <Button
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim() || !userName.trim() || !userEmail.trim() || !captchaInput.trim()}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>

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
                <AvatarFallback className={getAvatarColor(comment.user_name)}>
                  {getInitials(comment.user_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground truncate">
                    {comment.user_name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
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