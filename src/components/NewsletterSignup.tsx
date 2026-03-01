import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const { error } = await supabase
        .from("newsletter_subscribers" as any)
        .insert({ email } as any);

      if (error) {
        if (error.code === "23505") {
          setMessage("You're already subscribed!");
          setStatus("success");
        } else {
          throw error;
        }
      } else {
        setMessage("Successfully subscribed! 🎉");
        setStatus("success");
        setEmail("");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="py-12 bg-primary/5" aria-label="Newsletter signup">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">📬 Stay Updated</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Get the latest tools, tips, and updates delivered to your inbox. No spam, ever.
        </p>

        {status === "success" ? (
          <p className="text-primary font-medium">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm min-h-[44px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-destructive text-sm mt-2">{message}</p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSignup;
