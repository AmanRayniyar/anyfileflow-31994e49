import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tool } from "@/data/tools";

interface TextToolProps {
  tool: Tool;
}

const TextTool = ({ tool }: TextToolProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const processText = useCallback(() => {
    if (!input.trim()) {
      toast({
        title: "No text entered",
        description: "Please enter some text to process.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    let result = input;

    // Text transformations based on tool ID
    switch (tool.id) {
      case "word-counter":
        const words = input.trim().split(/\s+/).filter(w => w).length;
        const chars = input.length;
        const charsNoSpace = input.replace(/\s/g, "").length;
        const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
        const paragraphs = input.split(/\n\n+/).filter(p => p.trim()).length;
        result = `Words: ${words}\nCharacters: ${chars}\nCharacters (no spaces): ${charsNoSpace}\nSentences: ${sentences}\nParagraphs: ${paragraphs}`;
        break;

      case "character-counter":
        result = `Total characters: ${input.length}\nCharacters without spaces: ${input.replace(/\s/g, "").length}\nSpaces: ${(input.match(/\s/g) || []).length}`;
        break;

      case "sentence-case":
        result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;

      case "uppercase":
        result = input.toUpperCase();
        break;

      case "lowercase":
        result = input.toLowerCase();
        break;

      case "title-case":
        result = input.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        break;

      case "remove-line-breaks":
        result = input.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
        break;

      case "remove-spaces":
        result = input.replace(/\s+/g, " ").trim();
        break;

      case "remove-duplicates":
        const lines = input.split("\n");
        result = [...new Set(lines)].join("\n");
        break;

      case "sort-text":
        result = input.split("\n").sort((a, b) => a.localeCompare(b)).join("\n");
        break;

      case "case-swap":
        result = input.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
        break;

      case "emoji-remover":
        result = input.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "");
        break;

      case "text-reverse":
        result = input.split("").reverse().join("");
        break;

      case "lorem-ipsum":
        result = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        break;

      case "number-to-words":
        const num = parseInt(input.trim());
        if (!isNaN(num)) {
          result = numberToWords(num);
        } else {
          result = "Please enter a valid number";
        }
        break;

      case "paragraph-formatter":
        result = input
          .split(/\n\n+/)
          .map(p => p.replace(/\s+/g, " ").trim())
          .filter(p => p)
          .join("\n\n");
        break;

      default:
        result = input;
    }

    setOutput(result);
    setProcessing(false);
    toast({
      title: "Text processed!",
      description: "Your text has been transformed successfully.",
    });
  }, [input, tool.id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.id}-result.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6" role="region" aria-label={`${tool.name} tool interface`}>
      {/* Input */}
      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-foreground mb-2">
          Enter your text
        </label>
        <Textarea
          id="text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text here..."
          className="min-h-[160px] text-base resize-y"
          aria-describedby="input-hint"
        />
        <p id="input-hint" className="text-xs text-muted-foreground mt-1">
          {input.length} characters
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="hero"
          onClick={processText}
          disabled={processing || !input.trim()}
          className="flex-1 sm:flex-none"
          aria-busy={processing}
        >
          {processing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Process Text</span>
            </>
          )}
        </Button>
        <Button variant="outline" onClick={clearAll} aria-label="Clear all text">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Clear</span>
        </Button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="text-output" className="block text-sm font-medium text-foreground">
              Result
            </label>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-tool-archive" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only sm:not-sr-only">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadText} aria-label="Download result">
                <Download className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Download</span>
              </Button>
            </div>
          </div>
          <Textarea
            id="text-output"
            value={output}
            readOnly
            className="min-h-[160px] text-base bg-secondary/30 resize-y"
            aria-label="Processed text result"
          />
        </div>
      )}
    </div>
  );
};

// Helper function for number to words
function numberToWords(num: number): string {
  if (num === 0) return "zero";

  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const scales = ["", "thousand", "million", "billion", "trillion"];

  if (num < 0) return "negative " + numberToWords(-num);

  let words = "";
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      let chunkWords = "";
      const h = Math.floor(chunk / 100);
      const t = chunk % 100;

      if (h > 0) chunkWords += ones[h] + " hundred ";
      if (t >= 10 && t < 20) {
        chunkWords += teens[t - 10] + " ";
      } else {
        if (Math.floor(t / 10) > 0) chunkWords += tens[Math.floor(t / 10)] + " ";
        if (t % 10 > 0) chunkWords += ones[t % 10] + " ";
      }

      words = chunkWords + scales[scaleIndex] + " " + words;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return words.trim();
}

export default TextTool;
