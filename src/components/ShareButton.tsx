import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  description: string;
  url?: string;
}

const ShareButton = ({ title, description, url }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-[#1DA1F2]"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-[#4267B2]"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
      color: "hover:text-[#0077B5]"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`,
      color: "hover:text-[#25D366]"
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this tool: ${shareUrl}\n\n${description}`)}`,
      color: "hover:text-primary"
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Share failed");
        }
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" aria-label="Share this tool">
          <Share2 className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-foreground">Share this tool</h4>
          
          {/* Native Share Button (Mobile) */}
          {typeof navigator !== "undefined" && navigator.share && (
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2" 
              onClick={handleNativeShare}
              aria-label="Share via native sharing"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share via...
            </Button>
          )}
          
          {/* Social Links */}
          <nav aria-label="Share on social media">
            <ul className="grid grid-cols-5 gap-2 list-none p-0 m-0">
              {shareLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors ${link.color}`}
                    aria-label={`Share on ${link.name}`}
                  >
                    <link.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Copy Link */}
          <Button 
            variant="secondary" 
            className="w-full justify-between gap-2" 
            onClick={copyToClipboard}
            aria-label={copied ? "Link copied" : "Copy link to clipboard"}
          >
            <span className="truncate text-xs">{shareUrl}</span>
            {copied ? (
              <Check className="h-4 w-4 text-green-500 shrink-0" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
