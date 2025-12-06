import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Download, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Tool } from "@/data/tools";

interface GeneratorToolProps {
  tool: Tool;
}

const GeneratorTool = ({ tool }: GeneratorToolProps) => {
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    length: 16,
    count: 5,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    topic: "",
  });

  const generate = useCallback(() => {
    let result = "";

    switch (tool.id) {
      case "password-generator": {
        const passwords: string[] = [];
        let chars = "";
        if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
        if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (options.numbers) chars += "0123456789";
        if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        
        if (!chars) {
          result = "Please select at least one character type";
        } else {
          for (let i = 0; i < options.count; i++) {
            let password = "";
            for (let j = 0; j < options.length; j++) {
              password += chars[Math.floor(Math.random() * chars.length)];
            }
            passwords.push(password);
          }
          result = passwords.join("\n");
        }
        break;
      }

      case "username-generator": {
        const adjectives = ["Swift", "Brave", "Clever", "Mighty", "Silent", "Cosmic", "Golden", "Shadow", "Thunder", "Crystal", "Mystic", "Noble", "Radiant", "Storm", "Phoenix"];
        const nouns = ["Wolf", "Eagle", "Dragon", "Ninja", "Knight", "Wizard", "Hunter", "Ranger", "Warrior", "Rogue", "Sage", "Titan", "Falcon", "Bear", "Lion"];
        const usernames: string[] = [];
        
        for (let i = 0; i < options.count; i++) {
          const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
          const noun = nouns[Math.floor(Math.random() * nouns.length)];
          const num = Math.floor(Math.random() * 1000);
          usernames.push(`${adj}${noun}${num}`);
        }
        result = usernames.join("\n");
        break;
      }

      case "blog-ideas": {
        const templates = [
          `How to ${options.topic || "Master Any Skill"} in 30 Days`,
          `10 ${options.topic || "Productivity"} Tips That Actually Work`,
          `The Ultimate Guide to ${options.topic || "Success"}`,
          `Why ${options.topic || "Everyone"} Should Know About This`,
          `${options.topic || "This Topic"}: What Experts Won't Tell You`,
          `5 Common ${options.topic || "Mistakes"} and How to Avoid Them`,
          `The Future of ${options.topic || "Technology"}: What to Expect`,
          `How I ${options.topic || "Achieved My Goals"} (And You Can Too)`,
          `${options.topic || "This"} vs That: The Complete Comparison`,
          `Beginner's Guide to ${options.topic || "Getting Started"}`,
        ];
        result = templates.slice(0, options.count).join("\n");
        break;
      }

      case "caption-creator": {
        const captions = [
          `✨ ${options.topic || "Living my best life"} #blessed`,
          `🔥 ${options.topic || "Can't stop won't stop"} #motivation`,
          `💫 ${options.topic || "Making memories"} #goodvibes`,
          `🌟 ${options.topic || "Dream big"} #inspiration`,
          `💪 ${options.topic || "Work hard, play harder"} #hustle`,
        ];
        result = captions.slice(0, options.count).join("\n\n");
        break;
      }

      case "hashtag-generator": {
        const topic = options.topic || "photo";
        const baseTags = [
          `#${topic}`, `#${topic}graphy`, `#${topic}oftheday`, `#${topic}lover`,
          `#${topic}life`, `#best${topic}`, `#${topic}gram`, `#insta${topic}`,
          `#${topic}daily`, `#${topic}style`, `#${topic}community`, `#${topic}goals`,
        ];
        const general = ["#love", "#instagood", "#photooftheday", "#beautiful", "#happy", "#cute", "#tbt", "#followme", "#picoftheday", "#follow"];
        const combined = [...baseTags.slice(0, 10), ...general.slice(0, options.count > 10 ? options.count - 10 : 5)];
        result = combined.slice(0, options.count).join(" ");
        break;
      }

      case "quote-generator": {
        const quotes = [
          "The only way to do great work is to love what you do. - Steve Jobs",
          "In the middle of difficulty lies opportunity. - Albert Einstein",
          "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
          "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
          "It is during our darkest moments that we must focus to see the light. - Aristotle",
          "The only impossible journey is the one you never begin. - Tony Robbins",
          "Believe you can and you're halfway there. - Theodore Roosevelt",
          "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
        ];
        result = quotes[Math.floor(Math.random() * quotes.length)];
        break;
      }

      case "calendar-generator": {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let calendar = `${now.toLocaleString('default', { month: 'long' })} ${year}\n`;
        calendar += days.join("\t") + "\n";
        
        let week = Array(firstDay.getDay()).fill("  ");
        for (let d = 1; d <= lastDay.getDate(); d++) {
          week.push(d.toString().padStart(2, " "));
          if (week.length === 7) {
            calendar += week.join("\t") + "\n";
            week = [];
          }
        }
        if (week.length > 0) {
          calendar += week.join("\t");
        }
        result = calendar;
        break;
      }

      case "gradient-generator": {
        const colors = [
          ["#667eea", "#764ba2"],
          ["#f093fb", "#f5576c"],
          ["#4facfe", "#00f2fe"],
          ["#43e97b", "#38f9d7"],
          ["#fa709a", "#fee140"],
          ["#a8edea", "#fed6e3"],
          ["#ff9a9e", "#fecfef"],
          ["#ffecd2", "#fcb69f"],
        ];
        const selected = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.floor(Math.random() * 360);
        result = `background: linear-gradient(${angle}deg, ${selected[0]}, ${selected[1]});\n\n/* Tailwind */\nbg-gradient-to-r from-[${selected[0]}] to-[${selected[1]}]`;
        break;
      }

      default:
        result = "Generator not implemented";
    }

    setOutput(result);
    toast({ title: "Generated!", description: "Your content is ready." });
  }, [tool.id, options]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!" });
  };

  const getOptions = () => {
    switch (tool.id) {
      case "password-generator":
        return (
          <div className="space-y-4">
            <div>
              <Label>Password Length: {options.length}</Label>
              <Slider
                value={[options.length]}
                onValueChange={([v]) => setOptions(o => ({ ...o, length: v }))}
                min={8}
                max={64}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Number of Passwords: {options.count}</Label>
              <Slider
                value={[options.count]}
                onValueChange={([v]) => setOptions(o => ({ ...o, count: v }))}
                min={1}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => setOptions(o => ({ ...o, lowercase: e.target.checked }))}
                  className="rounded"
                />
                Lowercase (a-z)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => setOptions(o => ({ ...o, uppercase: e.target.checked }))}
                  className="rounded"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => setOptions(o => ({ ...o, numbers: e.target.checked }))}
                  className="rounded"
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => setOptions(o => ({ ...o, symbols: e.target.checked }))}
                  className="rounded"
                />
                Symbols (!@#$)
              </label>
            </div>
          </div>
        );

      case "blog-ideas":
      case "caption-creator":
      case "hashtag-generator":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic (optional)</Label>
              <Input
                id="topic"
                value={options.topic}
                onChange={(e) => setOptions(o => ({ ...o, topic: e.target.value }))}
                placeholder="Enter a topic..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Number of Results: {options.count}</Label>
              <Slider
                value={[options.count]}
                onValueChange={([v]) => setOptions(o => ({ ...o, count: v }))}
                min={1}
                max={20}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        );

      case "username-generator":
        return (
          <div>
            <Label>Number of Usernames: {options.count}</Label>
            <Slider
              value={[options.count]}
              onValueChange={([v]) => setOptions(o => ({ ...o, count: v }))}
              min={1}
              max={20}
              step={1}
              className="mt-2"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label={`${tool.name} generator`}>
      {/* Options */}
      {getOptions()}

      {/* Generate Button */}
      <Button variant="hero" onClick={generate} className="w-full sm:w-auto">
        <Shuffle className="h-4 w-4" aria-hidden="true" />
        Generate
      </Button>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Result</Label>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4 text-tool-archive" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[160px] font-mono text-sm bg-secondary/30 resize-y"
          />
        </div>
      )}
    </div>
  );
};

export default GeneratorTool;
