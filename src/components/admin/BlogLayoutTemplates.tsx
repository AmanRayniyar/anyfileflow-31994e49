import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Layout, Sparkles } from "lucide-react";

interface BlogLayoutTemplatesProps {
  onSelect: (template: { title: string; excerpt: string; content: string; category: string; tags: string }) => void;
}

// Generate 200 blog layout templates for different tools
const generateTemplates = () => {
  const toolCategories = [
    { name: "Image Tools", tools: ["JPG to PNG", "PNG to JPG", "WebP to PNG", "PNG to WebP", "GIF to PNG", "BMP to JPG", "TIFF to PNG", "SVG to PNG", "ICO to PNG", "HEIC to JPG", "Image Resizer", "Image Compressor", "Image Cropper", "Background Remover", "Image Watermark", "Image Rotate", "Image Flip", "Grayscale Converter", "Blur Image", "Sharpen Image", "Brightness Adjuster", "Contrast Adjuster", "Saturation Editor", "Hue Changer", "Color Inverter", "Sepia Filter", "Vintage Filter", "Cartoon Effect", "Pencil Sketch", "Oil Painting Effect", "Image Collage Maker", "Photo Frame Adder", "Image Overlay Tool", "Thumbnail Generator", "Avatar Maker"] },
    { name: "PDF Tools", tools: ["PDF to Word", "Word to PDF", "PDF to Excel", "Excel to PDF", "PDF to PowerPoint", "PowerPoint to PDF", "PDF to Image", "Image to PDF", "Merge PDF", "Split PDF", "Compress PDF", "PDF Protect", "PDF Unlock", "Rotate PDF", "PDF Watermark", "PDF Page Remover", "PDF to Text", "HTML to PDF", "PDF Signature", "PDF Annotation"] },
    { name: "Audio Tools", tools: ["MP3 to WAV", "WAV to MP3", "M4A to MP3", "FLAC to MP3", "OGG to MP3", "AAC to MP3", "WMA to MP3", "Audio Trimmer", "Audio Merger", "Audio Compressor", "Audio Converter", "Ringtone Maker", "Voice Recorder", "Audio Equalizer", "Noise Remover", "Audio Speed Changer", "Pitch Shifter", "Audio Reverser", "Fade In/Out Tool", "Audio Volume Booster"] },
    { name: "Video Tools", tools: ["MP4 to AVI", "AVI to MP4", "MOV to MP4", "MKV to MP4", "WebM to MP4", "FLV to MP4", "Video Trimmer", "Video Merger", "Video Compressor", "Video Cropper", "Video Resizer", "Video Rotate", "GIF Maker", "Video to Audio", "Subtitle Adder", "Video Watermark", "Video Speed Changer", "Video Reverser", "Frame Extractor", "Thumbnail Extractor"] },
    { name: "Text Tools", tools: ["Text Case Converter", "Word Counter", "Character Counter", "Lorem Ipsum Generator", "Text to Speech", "Speech to Text", "Text Formatter", "Remove Duplicates", "Sort Text Lines", "Reverse Text", "Text Encryption", "Text Decryption", "Base64 Encoder", "Base64 Decoder", "URL Encoder", "URL Decoder", "HTML Encoder", "HTML Decoder", "Markdown to HTML", "HTML to Markdown"] },
    { name: "Developer Tools", tools: ["JSON Formatter", "XML Formatter", "HTML Beautifier", "CSS Minifier", "JS Minifier", "Code Diff", "Regex Tester", "UUID Generator", "Hash Generator", "Color Picker", "Gradient Generator", "CSS Generator", "Favicon Generator", "QR Code Generator", "Barcode Generator", "Meta Tag Generator", "robots.txt Generator", "sitemap.xml Generator", "htaccess Generator", "JWT Decoder"] },
    { name: "Calculator Tools", tools: ["BMI Calculator", "Age Calculator", "Percentage Calculator", "Loan Calculator", "Mortgage Calculator", "Tip Calculator", "Discount Calculator", "Currency Converter", "Unit Converter", "Length Converter", "Weight Converter", "Temperature Converter", "Speed Converter", "Time Converter", "Data Size Converter", "Fuel Cost Calculator", "GPA Calculator", "Grade Calculator", "Calorie Calculator", "Body Fat Calculator"] },
    { name: "Utility Tools", tools: ["Countdown Timer", "Stopwatch", "Pomodoro Timer", "Alarm Clock", "World Clock", "Calendar Generator", "Date Calculator", "Time Zone Converter", "Random Number Generator", "Password Generator", "Lorem Picsum", "Placeholder Image", "Typing Speed Test", "Internet Speed Test", "IP Address Lookup", "Whois Lookup", "DNS Lookup", "SSL Checker", "HTTP Headers", "User Agent Parser"] }
  ];

  const templates: { id: string; title: string; excerpt: string; content: string; category: string; tags: string; icon: string }[] = [];
  let id = 1;

  toolCategories.forEach(category => {
    category.tools.forEach(tool => {
      const toolSlug = tool.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      templates.push({
        id: `template-${id}`,
        title: `Complete Guide to ${tool}: Features, Benefits & How to Use`,
        excerpt: `Discover how to use our free ${tool} tool effectively. Learn tips, tricks, and best practices for ${tool.toLowerCase()} conversion and processing.`,
        content: `<article>
<h2>What is ${tool}?</h2>
<p>${tool} is a powerful online tool designed to help you [describe main function]. Whether you're a professional or a beginner, this tool makes [task] simple and efficient.</p>

<h2>Key Features of ${tool}</h2>
<ul>
<li><strong>Fast Processing</strong> - Complete your tasks in seconds</li>
<li><strong>High Quality Output</strong> - Maintain the best quality possible</li>
<li><strong>Free to Use</strong> - No registration or payment required</li>
<li><strong>Privacy Focused</strong> - All processing happens in your browser</li>
<li><strong>Mobile Friendly</strong> - Works on all devices</li>
</ul>

<h2>How to Use ${tool}</h2>
<ol>
<li>Upload your file using drag-and-drop or click to select</li>
<li>Configure your preferred settings (if applicable)</li>
<li>Click the process/convert button</li>
<li>Download your processed file instantly</li>
</ol>

<h2>Why Choose AnyFile Flow's ${tool}?</h2>
<p>AnyFile Flow provides the most reliable and user-friendly ${tool.toLowerCase()} solution available online. Our tool is:</p>
<ul>
<li>100% free with no hidden costs</li>
<li>Secure and private - files never leave your device</li>
<li>Fast and efficient processing</li>
<li>No software installation required</li>
</ul>

<h2>Common Use Cases</h2>
<p>Our ${tool} is perfect for:</p>
<ul>
<li>Personal projects and creative work</li>
<li>Professional and business applications</li>
<li>Educational purposes</li>
<li>Quick conversions on the go</li>
</ul>

<h2>Tips for Best Results</h2>
<p>Follow these tips to get the most out of ${tool}:</p>
<ol>
<li>Use high-quality source files when possible</li>
<li>Check the output settings before processing</li>
<li>Preview results when available</li>
<li>Save your work regularly</li>
</ol>

<h2>Frequently Asked Questions</h2>
<h3>Is ${tool} free to use?</h3>
<p>Yes! Our ${tool} is completely free with no registration required.</p>

<h3>Is my data secure?</h3>
<p>Absolutely. All processing happens locally in your browser. We never upload or store your files.</p>

<h3>What file formats are supported?</h3>
<p>We support all major formats relevant to ${tool.toLowerCase()}. Check the tool page for specific format details.</p>

<h2>Conclusion</h2>
<p>Try our ${tool} today and experience the easiest way to handle your ${tool.toLowerCase()} needs. Fast, free, and secure - exactly what you need.</p>
</article>`,
        category: category.name,
        tags: `${toolSlug}, ${category.name.toLowerCase()}, online tool, free tool, converter`,
        icon: "FileText"
      });
      id++;
    });
  });

  return templates;
};

const templates = generateTemplates();

export function BlogLayoutTemplates({ onSelect }: BlogLayoutTemplatesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Layout className="h-4 w-4" />
        <span>{templates.length} blog templates available</span>
      </div>
      
      <ScrollArea className="h-[400px] border border-border rounded-lg">
        <div className="p-4 space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => onSelect({
                title: template.title,
                excerpt: template.excerpt,
                content: template.content,
                category: template.category,
                tags: template.tags
              })}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <h4 className="font-medium text-sm truncate">{template.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {template.category}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
