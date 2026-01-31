import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Copy, Check, Download, Trash2, Share2, RotateCcw, 
  Twitter, Instagram, Youtube, Facebook, MessageSquare, Search,
  GraduationCap, Video, Sparkles, Volume2, VolumeX, Shield,
  Languages, Clock, BookOpen, Type, Hash, AlignLeft, FileText,
  Zap, AlertTriangle, TrendingUp, Smile, Globe, Target,
  Wand2, BarChart3, Eye, Minus, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAnyFlowAI } from "@/hooks/useAnyFlowAI";

// Platform character limits
const PLATFORM_LIMITS = {
  twitter: { title: "Twitter/X", limit: 280, icon: Twitter },
  instagram: { title: "Instagram Caption", limit: 2200, icon: Instagram },
  youtube_title: { title: "YouTube Title", limit: 100, icon: Youtube },
  youtube_desc: { title: "YouTube Description", limit: 5000, icon: Youtube },
  facebook: { title: "Facebook Post", limit: 63206, icon: Facebook },
  sms_gsm: { title: "SMS (GSM)", limit: 160, icon: MessageSquare },
  sms_unicode: { title: "SMS (Unicode)", limit: 70, icon: MessageSquare },
  meta_title: { title: "SEO Title", limit: 60, icon: Search },
  meta_desc: { title: "SEO Description", limit: 160, icon: Search },
};

// Readability helper functions
const syllableCount = (word: string): number => {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};

const calculateFleschScore = (text: string): number => {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (words.length === 0 || sentences.length === 0) return 0;
  
  const totalSyllables = words.reduce((acc, word) => acc + syllableCount(word), 0);
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = totalSyllables / words.length;
  
  return Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)));
};

const getReadabilityGrade = (score: number): { grade: string; color: string; description: string } => {
  if (score >= 90) return { grade: "Very Easy", color: "text-green-500", description: "5th Grade" };
  if (score >= 80) return { grade: "Easy", color: "text-green-400", description: "6th Grade" };
  if (score >= 70) return { grade: "Fairly Easy", color: "text-emerald-500", description: "7th Grade" };
  if (score >= 60) return { grade: "Standard", color: "text-yellow-500", description: "8-9th Grade" };
  if (score >= 50) return { grade: "Fairly Difficult", color: "text-orange-500", description: "10-12th Grade" };
  if (score >= 30) return { grade: "Difficult", color: "text-red-400", description: "College" };
  return { grade: "Very Difficult", color: "text-red-500", description: "College Graduate" };
};

// Detect passive voice
const detectPassiveVoice = (text: string): string[] => {
  const passivePattern = /\b(am|is|are|was|were|been|being|be)\s+(\w+ed|made|done|taken|given|shown|known|seen|found|left|kept|felt|put|set|read|run|cut|hit|hurt|let|shut|spread|split|cast|cost|burst|wet|wed|rid|spit|quit)\b/gi;
  const matches = text.match(passivePattern);
  return matches || [];
};

// Find overused words
const findOverusedWords = (text: string): { word: string; count: number }[] => {
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const stopWords = new Set(['that', 'this', 'with', 'have', 'from', 'they', 'will', 'would', 'could', 'should', 'there', 'their', 'about', 'which', 'when', 'what', 'been', 'were', 'also', 'more', 'some', 'than', 'into', 'only', 'very', 'just', 'other', 'such', 'like', 'then']);
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
};

// Detect language
const detectLanguage = (text: string): string => {
  const hindi = /[\u0900-\u097F]/;
  const nepali = /[\u0900-\u097F]/;
  const arabic = /[\u0600-\u06FF]/;
  const chinese = /[\u4E00-\u9FFF]/;
  const japanese = /[\u3040-\u309F\u30A0-\u30FF]/;
  const korean = /[\uAC00-\uD7AF]/;
  const cyrillic = /[\u0400-\u04FF]/;
  const thai = /[\u0E00-\u0E7F]/;
  
  if (arabic.test(text)) return "Arabic";
  if (chinese.test(text)) return "Chinese";
  if (japanese.test(text)) return "Japanese";
  if (korean.test(text)) return "Korean";
  if (hindi.test(text) || nepali.test(text)) return "Hindi/Nepali";
  if (cyrillic.test(text)) return "Russian/Cyrillic";
  if (thai.test(text)) return "Thai";
  return "English";
};

// Count emojis
const countEmojis = (text: string): number => {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
};

// Keyword density calculation
const calculateKeywordDensity = (text: string): { word: string; count: number; density: number }[] => {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const totalWords = words.length;
  if (totalWords === 0) return [];
  
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'from', 'this', 'that', 'with', 'they', 'will', 'would', 'there', 'their', 'what', 'about', 'which', 'when', 'make', 'like', 'time', 'just', 'know', 'take', 'come', 'could', 'than', 'into', 'your', 'some', 'them', 'other']);
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    if (!stopWords.has(word) && word.length >= 3) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .map(([word, count]) => ({ word, count, density: (count / totalWords) * 100 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
};

// Stop words count
const countStopWords = (text: string): { count: number; percentage: number } => {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also']);
  
  const stopWordCount = words.filter(w => stopWords.has(w)).length;
  return {
    count: stopWordCount,
    percentage: words.length > 0 ? (stopWordCount / words.length) * 100 : 0
  };
};

// YouTube title SEO score
const calculateYouTubeSEOScore = (title: string): { score: number; tips: string[] } => {
  const tips: string[] = [];
  let score = 50;
  
  if (title.length >= 40 && title.length <= 60) score += 10;
  else if (title.length < 40) tips.push("Title is too short. Aim for 40-60 characters.");
  else if (title.length > 70) tips.push("Title is too long. Keep under 70 characters.");
  
  if (/\d/.test(title)) score += 10;
  else tips.push("Add numbers to increase CTR.");
  
  if (/[!?]/.test(title)) score += 5;
  
  const powerWords = ['best', 'top', 'how', 'why', 'ultimate', 'complete', 'guide', 'tips', 'secrets', 'free', 'new', 'easy', 'fast', 'simple', 'proven', 'amazing', 'incredible'];
  if (powerWords.some(w => title.toLowerCase().includes(w))) score += 10;
  else tips.push("Use power words like 'Best', 'Top', 'How to', 'Guide'.");
  
  if (/[\[\(].+[\]\)]/.test(title)) score += 10;
  else tips.push("Add brackets like [2025] or (Full Guide).");
  
  if (title.charAt(0) === title.charAt(0).toUpperCase()) score += 5;
  
  return { score: Math.min(100, score), tips };
};

// Hook strength meter
const calculateHookStrength = (text: string): { score: number; feedback: string } => {
  const firstSentence = text.split(/[.!?]/)[0] || "";
  let score = 30;
  
  if (firstSentence.length >= 10 && firstSentence.length <= 100) score += 20;
  if (/you|your/i.test(firstSentence)) score += 15;
  if (/\?/.test(firstSentence)) score += 15;
  if (/how|what|why|when|where|who/i.test(firstSentence)) score += 10;
  if (/!/.test(firstSentence)) score += 5;
  if (/\d/.test(firstSentence)) score += 5;
  
  let feedback = "";
  if (score >= 80) feedback = "Excellent hook! Very engaging.";
  else if (score >= 60) feedback = "Good hook. Could be more engaging.";
  else if (score >= 40) feedback = "Average hook. Try adding a question or 'you'.";
  else feedback = "Weak hook. Start with a question or direct address.";
  
  return { score: Math.min(100, score), feedback };
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
  animate?: boolean;
}

const StatCard = ({ icon, label, value, subValue, highlight, animate }: StatCardProps) => (
  <Card className={cn(
    "transition-all duration-300",
    highlight && "ring-2 ring-primary",
    animate && "animate-pulse"
  )}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface PlatformLimitProps {
  platform: keyof typeof PLATFORM_LIMITS;
  currentCount: number;
}

const PlatformLimit = ({ platform, currentCount }: PlatformLimitProps) => {
  const { title, limit, icon: Icon } = PLATFORM_LIMITS[platform];
  const percentage = Math.min(100, (currentCount / limit) * 100);
  const isExceeded = currentCount > limit;
  const remaining = limit - currentCount;
  
  return (
    <div className={cn(
      "p-3 rounded-lg border transition-all",
      isExceeded ? "border-destructive bg-destructive/10" : "border-border"
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", isExceeded && "text-destructive")} />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className={cn(
          "text-sm font-mono",
          isExceeded ? "text-destructive font-bold" : "text-muted-foreground"
        )}>
          {currentCount}/{limit}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn("h-2", isExceeded && "[&>div]:bg-destructive")} 
      />
      <p className={cn(
        "text-xs mt-1",
        isExceeded ? "text-destructive" : "text-muted-foreground"
      )}>
        {isExceeded ? `${Math.abs(remaining)} over limit!` : `${remaining} remaining`}
      </p>
    </div>
  );
};

const WordCounterTool = () => {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"standard" | "student" | "creator">("standard");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const { open: openAI } = useAnyFlowAI();
  
  // Memoized calculations for performance
  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const words = trimmedText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const lines = text.split(/\n/).length;
    
    // Page counts (assuming 250 words/page standard, 500 words/A4, 300 words/Google Docs)
    const pagesWord = Math.ceil(wordCount / 250);
    const pagesA4 = Math.ceil(wordCount / 500);
    const pagesGoogleDocs = Math.ceil(wordCount / 300);
    
    // Reading & speaking time
    const readingTimeAvg = Math.ceil(wordCount / 200); // 200 wpm average
    const readingTimeSlow = Math.ceil(wordCount / 150); // 150 wpm slow
    const speakingTime = Math.ceil(wordCount / 130); // 130 wpm speaking
    
    // Advanced analysis
    const longestWord = words.reduce((longest, current) => 
      current.length > longest.length ? current : longest, "");
    const avgWordLength = words.length > 0 
      ? (words.reduce((sum, w) => sum + w.length, 0) / words.length).toFixed(1)
      : "0";
    
    const fleschScore = calculateFleschScore(text);
    const readabilityInfo = getReadabilityGrade(fleschScore);
    const passiveVoice = detectPassiveVoice(text);
    const overusedWords = findOverusedWords(text);
    const keywordDensity = calculateKeywordDensity(text);
    const stopWords = countStopWords(text);
    const language = detectLanguage(text);
    const emojiCount = countEmojis(text);
    const unicodeCount = text.replace(/[\x00-\x7F]/g, "").length;
    
    // Creator mode
    const youtubeSEO = calculateYouTubeSEOScore(text);
    const hookStrength = calculateHookStrength(text);
    const hashtagCount = (text.match(/#\w+/g) || []).length;
    
    return {
      wordCount,
      charCount,
      charNoSpaces,
      sentences,
      paragraphs,
      lines,
      pagesWord,
      pagesA4,
      pagesGoogleDocs,
      readingTimeAvg,
      readingTimeSlow,
      speakingTime,
      longestWord,
      avgWordLength,
      fleschScore,
      readabilityInfo,
      passiveVoice,
      overusedWords,
      keywordDensity,
      stopWords,
      language,
      emojiCount,
      unicodeCount,
      youtubeSEO,
      hookStrength,
      hashtagCount,
    };
  }, [text]);
  
  // Sound effect on milestone
  useEffect(() => {
    if (soundEnabled && stats.wordCount > 0 && stats.wordCount % 100 === 0) {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2NvUezEqRqDh38lhEQFCpuHdzlslFkaU0tC3XS0WM4DN0JpKJCEnhtDRrVwiGUmFy9O+fUUTJ2+63r93LwAOXZrZ0adTGQc6h8zQrHgxGj+Fz8+baTcHBWGl0KBYHwoqcbrOpF0cFE6N1clqMQ8lcLjNnVgcFEyW09qfdB0MR4q/0qFaHw0obsfImVsaETaEz9amXBoKNYHM0Z5SFxE3d77SlVMXFDN7x8mKUBgMPJPKw3ovDSFjscXGdiwGI3K4y7heCjg7g7bJsmIVBDduscSpaiIKJmi/xad0HDNQVX/Dplo=");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [stats.wordCount, soundEnabled]);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied!", description: "Text copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };
  
  const copyStats = async () => {
    const statsText = `📊 Text Statistics
─────────────────
📝 Words: ${stats.wordCount}
📏 Characters: ${stats.charCount}
✂️ Characters (no spaces): ${stats.charNoSpaces}
📄 Sentences: ${stats.sentences}
📑 Paragraphs: ${stats.paragraphs}
📖 Lines: ${stats.lines}
⏱️ Reading time: ~${stats.readingTimeAvg} min
🗣️ Speaking time: ~${stats.speakingTime} min
📊 Readability: ${stats.readabilityInfo.grade} (${stats.fleschScore.toFixed(0)})

Generated by AnyFile Flow Word Counter
https://anyfileflow.com/tool/word-counter`;
    
    try {
      await navigator.clipboard.writeText(statsText);
      toast({ title: "Stats copied!", description: "Statistics copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };
  
  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text-document.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const clearText = () => {
    setText("");
    toast({ title: "Cleared!", description: "Text has been cleared." });
  };
  
  const handleAIAction = async (action: "improve" | "shorten" | "expand" | "formal" | "casual" | "grammar") => {
    if (!text.trim()) {
      toast({ title: "No text", description: "Please enter some text first.", variant: "destructive" });
      return;
    }
    
    setAiProcessing(true);
    openAI();
    
    toast({
      title: "AI Assistant Opened",
      description: `Ask AnyFlow AI to ${action} your text.`,
    });
    
    setAiProcessing(false);
  };
  
  // Estimate essay grade (basic)
  const getEssayGrade = (): { grade: string; feedback: string } => {
    const { wordCount, fleschScore, sentences, paragraphs } = stats;
    
    if (wordCount < 100) return { grade: "Too Short", feedback: "Write at least 100 words" };
    if (wordCount < 250) return { grade: "Short Answer", feedback: "Good for brief responses" };
    if (wordCount < 500) return { grade: "C-B", feedback: "Meets minimum requirements" };
    if (wordCount < 800) return { grade: "B", feedback: "Good essay length" };
    if (wordCount >= 800 && fleschScore >= 50 && paragraphs >= 4) return { grade: "A", feedback: "Excellent length & structure" };
    if (wordCount >= 1000) return { grade: "A+", feedback: "Comprehensive essay" };
    return { grade: "B+", feedback: "Good work" };
  };

  return (
    <div className="space-y-6" role="region" aria-label="Word Counter Tool">
      {/* Privacy Badge */}
      <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
        <Shield className="h-4 w-4 text-green-500" />
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          100% Privacy – Your text never leaves your browser
        </span>
      </div>
      
      {/* Mode Selector & Settings */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)} className="w-auto">
          <TabsList>
            <TabsTrigger value="standard" className="gap-2">
              <Type className="h-4 w-4" />
              Standard
            </TabsTrigger>
            <TabsTrigger value="student" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Student
            </TabsTrigger>
            <TabsTrigger value="creator" className="gap-2">
              <Video className="h-4 w-4" />
              Creator
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              aria-label="Toggle milestone sounds"
            />
            <label htmlFor="sound-toggle" className="text-sm flex items-center gap-1 cursor-pointer">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="sr-only sm:not-sr-only">Sound</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Text Input Area with Sticky Counter */}
      <div className="relative">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-3 flex flex-wrap items-center gap-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-primary" />
            <span className="text-3xl font-bold tabular-nums">{stats.wordCount}</span>
            <span className="text-muted-foreground">words</span>
          </div>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{stats.charCount} chars</span>
            <span>{stats.sentences} sentences</span>
            <span className="hidden sm:inline">{stats.paragraphs} paragraphs</span>
          </div>
        </div>
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here... Real-time counting, no button needed!"
          className="min-h-[300px] text-base resize-y rounded-t-none border-t-0 focus-visible:ring-0"
          aria-label="Text input area"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Text"}
        </Button>
        <Button variant="outline" size="sm" onClick={copyStats}>
          <Share2 className="h-4 w-4" />
          Share Stats
        </Button>
        <Button variant="outline" size="sm" onClick={downloadText}>
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={clearText}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>
      
      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={<Hash className="h-5 w-5" />} label="Words" value={stats.wordCount} />
        <StatCard icon={<Type className="h-5 w-5" />} label="Characters" value={stats.charCount} subValue={`${stats.charNoSpaces} no spaces`} />
        <StatCard icon={<AlignLeft className="h-5 w-5" />} label="Sentences" value={stats.sentences} />
        <StatCard icon={<FileText className="h-5 w-5" />} label="Paragraphs" value={stats.paragraphs} />
        <StatCard icon={<BookOpen className="h-5 w-5" />} label="Lines" value={stats.lines} />
        <StatCard icon={<FileText className="h-5 w-5" />} label="Pages" value={stats.pagesWord} subValue="~250 words/page" />
      </div>
      
      {/* Time Estimates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Estimates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold">{stats.readingTimeAvg}</p>
              <p className="text-xs text-muted-foreground">min avg read</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold">{stats.readingTimeSlow}</p>
              <p className="text-xs text-muted-foreground">min slow read</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold">{stats.speakingTime}</p>
              <p className="text-xs text-muted-foreground">min speaking</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold">{stats.pagesA4}</p>
              <p className="text-xs text-muted-foreground">A4 pages</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Platform Limits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Platform Character Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.keys(PLATFORM_LIMITS).map((platform) => (
              <PlatformLimit 
                key={platform} 
                platform={platform as keyof typeof PLATFORM_LIMITS} 
                currentCount={stats.charCount} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Advanced Analysis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Writing Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Readability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Flesch Readability Score</span>
              <span className={cn("text-sm font-bold", stats.readabilityInfo.color)}>
                {stats.fleschScore.toFixed(0)} - {stats.readabilityInfo.grade}
              </span>
            </div>
            <Progress value={stats.fleschScore} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Reading level: {stats.readabilityInfo.description}
            </p>
          </div>
          
          {/* Word Analysis */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Longest Word</p>
              <p className="font-mono text-sm truncate">{stats.longestWord || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Word Length</p>
              <p className="font-mono text-sm">{stats.avgWordLength} chars</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stop Words</p>
              <p className="font-mono text-sm">{stats.stopWords.percentage.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Passive Voice</p>
              <p className="font-mono text-sm">{stats.passiveVoice.length} instances</p>
            </div>
          </div>
          
          {/* Overused Words */}
          {stats.overusedWords.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Overused Words
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.overusedWords.map(({ word, count }) => (
                  <Badge key={word} variant="outline" className="font-mono">
                    {word} ({count}×)
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Keyword Density */}
          {stats.keywordDensity.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Keyword Density
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.keywordDensity.slice(0, 10).map(({ word, density }) => (
                  <Badge key={word} variant="secondary" className="font-mono">
                    {word}: {density.toFixed(1)}%
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Multilingual Support */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Multilingual Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Detected Language</p>
              <p className="font-medium flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {stats.language}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Unicode Characters</p>
              <p className="font-mono text-sm">{stats.unicodeCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Emojis</p>
              <p className="font-mono text-sm flex items-center gap-1">
                <Smile className="h-4 w-4" />
                {stats.emojiCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Special Characters</p>
              <p className="font-mono text-sm">{stats.charCount - stats.charNoSpaces - (text.match(/\s/g)?.length || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Student Mode */}
      {mode === "student" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Student Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary/30 rounded-lg text-center">
                <p className="text-3xl font-bold">{getEssayGrade().grade}</p>
                <p className="text-xs text-muted-foreground">Estimated Grade</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg text-center">
                <p className="text-2xl font-bold">
                  {stats.wordCount < 100 ? "Short" : stats.wordCount < 300 ? "Medium" : "Long"}
                </p>
                <p className="text-xs text-muted-foreground">Answer Length</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg text-center">
                <p className="text-2xl font-bold">{stats.pagesWord}</p>
                <p className="text-xs text-muted-foreground">Pages (Word)</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg text-center">
                <p className="text-2xl font-bold">{stats.pagesGoogleDocs}</p>
                <p className="text-xs text-muted-foreground">Pages (Docs)</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              💡 {getEssayGrade().feedback}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Creator Mode */}
      {mode === "creator" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5" />
              Creator Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* YouTube SEO Score */}
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">YouTube Title SEO</span>
                  <span className={cn(
                    "text-xl font-bold",
                    stats.youtubeSEO.score >= 80 ? "text-green-500" :
                    stats.youtubeSEO.score >= 60 ? "text-yellow-500" : "text-red-500"
                  )}>
                    {stats.youtubeSEO.score}/100
                  </span>
                </div>
                <Progress value={stats.youtubeSEO.score} className="h-2 mb-2" />
                {stats.youtubeSEO.tips.length > 0 && (
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {stats.youtubeSEO.tips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Hook Strength */}
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Hook Strength</span>
                  <span className={cn(
                    "text-xl font-bold",
                    stats.hookStrength.score >= 80 ? "text-green-500" :
                    stats.hookStrength.score >= 60 ? "text-yellow-500" : "text-red-500"
                  )}>
                    {stats.hookStrength.score}/100
                  </span>
                </div>
                <Progress value={stats.hookStrength.score} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">{stats.hookStrength.feedback}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-2xl font-bold">{stats.hashtagCount}</p>
                <p className="text-xs text-muted-foreground">Hashtags</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-2xl font-bold">{stats.emojiCount}</p>
                <p className="text-xs text-muted-foreground">Emojis</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-2xl font-bold">{stats.charCount}</p>
                <p className="text-xs text-muted-foreground">Chars</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* AI Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAIAction("improve")}
              disabled={aiProcessing}
              className="gap-1"
            >
              <Wand2 className="h-4 w-4" />
              Improve
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAIAction("shorten")}
              disabled={aiProcessing}
              className="gap-1"
            >
              <Minus className="h-4 w-4" />
              Shorten
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAIAction("expand")}
              disabled={aiProcessing}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Expand
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAIAction("formal")}
              disabled={aiProcessing}
              className="gap-1"
            >
              <GraduationCap className="h-4 w-4" />
              Formal
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAIAction("casual")}
              disabled={aiProcessing}
              className="gap-1"
            >
              <Smile className="h-4 w-4" />
              Casual
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAIAction("grammar")}
              disabled={aiProcessing}
              className="gap-1"
            >
              <Eye className="h-4 w-4" />
              Grammar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Click any action to open AnyFlow AI assistant
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordCounterTool;
