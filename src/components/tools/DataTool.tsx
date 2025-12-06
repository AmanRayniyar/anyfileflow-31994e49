import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Download, Trash2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tool } from "@/data/tools";

interface DataToolProps {
  tool: Tool;
}

const DataTool = ({ tool }: DataToolProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const processData = useCallback(async () => {
    if (!input.trim() && !['uuid-generator', 'ip-finder', 'user-agent', 'screen-resolution'].includes(tool.id)) {
      toast({
        title: "No input provided",
        description: "Please enter data to process.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    let result = "";

    try {
      switch (tool.id) {
        case "json-formatter":
          result = JSON.stringify(JSON.parse(input), null, 2);
          break;

        case "json-validator":
          try {
            JSON.parse(input);
            result = "✓ Valid JSON";
          } catch (e) {
            result = `✗ Invalid JSON: ${(e as Error).message}`;
          }
          break;

        case "json-to-csv": {
          const jsonData = JSON.parse(input);
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            const headers = Object.keys(jsonData[0]);
            const csv = [
              headers.join(","),
              ...jsonData.map(row => 
                headers.map(h => JSON.stringify(row[h] ?? "")).join(",")
              )
            ].join("\n");
            result = csv;
          } else {
            result = "Input must be an array of objects";
          }
          break;
        }

        case "csv-to-json": {
          const lines = input.trim().split("\n");
          const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
          const json = lines.slice(1).map(line => {
            const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
            return headers.reduce((obj, h, i) => ({ ...obj, [h]: values[i] }), {});
          });
          result = JSON.stringify(json, null, 2);
          break;
        }

        case "html-minifier":
          result = input.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
          break;

        case "css-minifier":
          result = input
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/\s+/g, " ")
            .replace(/\s*([{}:;,])\s*/g, "$1")
            .trim();
          break;

        case "js-minifier":
          result = input
            .replace(/\/\/.*$/gm, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/\s+/g, " ")
            .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, "$1")
            .trim();
          break;

        case "uuid-generator":
          result = Array.from({ length: 5 }, () => crypto.randomUUID()).join("\n");
          break;

        case "base64-encoder":
          result = btoa(input);
          break;

        case "base64-decoder":
          result = atob(input);
          break;

        case "url-encoder":
          result = encodeURIComponent(input);
          break;

        case "url-decoder":
          result = decodeURIComponent(input);
          break;

        case "md5-generator":
          // Simple hash function (not cryptographically secure, for demo)
          result = await simpleHash(input, "MD5");
          break;

        case "sha256-generator":
          const encoder = new TextEncoder();
          const data = encoder.encode(input);
          const hashBuffer = await crypto.subtle.digest("SHA-256", data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          result = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
          break;

        case "qr-generator":
          // Generate QR code using API
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(input)}`;
          setQrDataUrl(qrUrl);
          result = "QR Code generated!";
          break;

        case "hex-to-rgb": {
          const hex = input.replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          result = `RGB: ${r}, ${g}, ${b}\nrgb(${r}, ${g}, ${b})`;
          break;
        }

        case "rgb-to-hex": {
          const match = input.match(/(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)/);
          if (match) {
            const [, r, g, b] = match.map(Number);
            result = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
          } else {
            result = "Invalid RGB format. Use: 255, 128, 0";
          }
          break;
        }

        case "password-strength": {
          const password = input;
          let score = 0;
          if (password.length >= 8) score++;
          if (password.length >= 12) score++;
          if (/[a-z]/.test(password)) score++;
          if (/[A-Z]/.test(password)) score++;
          if (/[0-9]/.test(password)) score++;
          if (/[^a-zA-Z0-9]/.test(password)) score++;
          
          const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
          result = `Strength: ${levels[Math.min(score, 5)]} (${score}/6)\n\n`;
          result += `Length: ${password.length} characters\n`;
          result += `Lowercase: ${/[a-z]/.test(password) ? "✓" : "✗"}\n`;
          result += `Uppercase: ${/[A-Z]/.test(password) ? "✓" : "✗"}\n`;
          result += `Numbers: ${/[0-9]/.test(password) ? "✓" : "✗"}\n`;
          result += `Symbols: ${/[^a-zA-Z0-9]/.test(password) ? "✓" : "✗"}`;
          break;
        }

        case "ip-finder":
          try {
            const res = await fetch("https://api.ipify.org?format=json");
            const data = await res.json();
            result = `Your IP Address: ${data.ip}`;
          } catch {
            result = "Could not fetch IP address";
          }
          break;

        case "user-agent":
          result = navigator.userAgent;
          break;

        case "screen-resolution":
          result = `Screen: ${screen.width} x ${screen.height}\nViewport: ${window.innerWidth} x ${window.innerHeight}\nDevice Pixel Ratio: ${window.devicePixelRatio}`;
          break;

        case "regex-tester": {
          try {
            const lines = input.split("\n");
            const pattern = lines[0];
            const text = lines.slice(1).join("\n");
            const regex = new RegExp(pattern, "g");
            const matches = text.match(regex);
            result = matches ? `Matches found: ${matches.length}\n\n${matches.join("\n")}` : "No matches found";
          } catch (e) {
            result = `Invalid regex: ${(e as Error).message}`;
          }
          break;
        }

        default:
          result = input;
      }
    } catch (error) {
      result = `Error: ${(error as Error).message}`;
    }

    setOutput(result);
    setProcessing(false);
    if (result && !result.startsWith("Error")) {
      toast({ title: "Processed!", description: "Your data has been processed." });
    }
  }, [input, tool.id]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!" });
  };

  const downloadResult = () => {
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
    setQrDataUrl("");
  };

  // Simple hash function for demo purposes
  async function simpleHash(str: string, type: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
  }

  const getPlaceholder = () => {
    switch (tool.id) {
      case "json-formatter":
      case "json-validator":
        return '{"name": "John", "age": 30}';
      case "json-to-csv":
        return '[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]';
      case "csv-to-json":
        return "name,age\nJohn,30\nJane,25";
      case "regex-tester":
        return "\\d+\n\nEnter regex pattern on first line, text to test on following lines";
      case "hex-to-rgb":
        return "#FF5733";
      case "rgb-to-hex":
        return "255, 87, 51";
      default:
        return "Enter your data here...";
    }
  };

  const needsInput = !['uuid-generator', 'ip-finder', 'user-agent', 'screen-resolution'].includes(tool.id);

  return (
    <div className="space-y-6" role="region" aria-label={`${tool.name} tool interface`}>
      {/* Input */}
      {needsInput && (
        <div>
          <Label htmlFor="data-input" className="text-sm font-medium">
            Input
          </Label>
          <Textarea
            id="data-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="min-h-[160px] font-mono text-sm mt-1 resize-y"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="hero"
          onClick={processData}
          disabled={processing}
          className="flex-1 sm:flex-none"
        >
          {processing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Process
        </Button>
        <Button variant="outline" onClick={clearAll}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* QR Code Display */}
      {qrDataUrl && (
        <div className="flex flex-col items-center gap-4 p-6 bg-secondary/30 rounded-xl">
          <img src={qrDataUrl} alt="Generated QR Code" className="rounded-lg" />
          <a href={qrDataUrl} download="qrcode.png" className="text-sm text-primary hover:underline">
            Download QR Code
          </a>
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="data-output">Result</Label>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-tool-archive" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadResult}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <Textarea
            id="data-output"
            value={output}
            readOnly
            className="min-h-[160px] font-mono text-sm bg-secondary/30 resize-y"
          />
        </div>
      )}
    </div>
  );
};

export default DataTool;
