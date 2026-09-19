import { 
  Image, FileText, Music, Video, Archive, Code, Database, Type,
  RefreshCw, Minimize2, Maximize2, Crop, Palette, Wand2, Layers,
  FileImage, FileAudio, FileVideo, FileArchive, FileCode, FileSpreadsheet,
  Hash, Lock, Unlock, Key, Shield, Eye, EyeOff, Shuffle,
  Download, Upload, Link, QrCode, Barcode, Clock, Calendar,
  Calculator, Percent, DollarSign, TrendingUp, RotateCcw, RotateCw,
  FlipHorizontal, FlipVertical, Scissors, Eraser, Brush, Droplet,
  Sun, Moon, Contrast, Sparkles, Filter, Sliders, ZoomIn, ZoomOut,
  Volume2, VolumeX, Mic, Headphones, Radio, Disc, Play, Pause,
  FastForward, Rewind, SkipForward, SkipBack, Repeat, Music2,
  Film, Clapperboard, MonitorPlay, Tv, Camera, Aperture,
  FolderArchive, Package, Box, Inbox, FolderOpen, FolderClosed,
  Binary, Braces, Terminal, GitBranch, FileJson, Regex,
  Table, Grid3X3, LayoutGrid, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Quote, Heading1, Heading2, PilcrowSquare, CaseSensitive, Subscript,
  Activity, Heart, Dumbbell, Baby, Timer, Gauge, Scale, Droplets,
  Thermometer, Brain, Cookie, Bed, Footprints, HeartPulse, Ruler,
  ImagePlus, ImageMinus, Stamp, Sticker, Laugh, Grid, Pipette,
  Waves, AudioLines, AudioWaveform, Merge, Split, Copy, Trash2,
  LayoutDashboard, Square, Circle, Triangle, Move, AlignJustify,
  Type as TypeIcon, Smartphone, Globe, Wifi, MapPin, Search,
  Check, X, AlertCircle, Info, HelpCircle, Settings, User,
  LucideIcon
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  from: string;
  to: string;
  popular?: boolean;
  toolType?: 'image-convert' | 'image-edit' | 'pdf' | 'audio' | 'video' | 'text' | 'data' | 'health' | 'generator' | 'finance';
}

export type ToolCategory = 
  | "image" 
  | "document" 
  | "audio" 
  | "video" 
  | "archive" 
  | "code" 
  | "data" 
  | "text"
  | "health"
  | "finance";

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export const categories: CategoryInfo[] = [
  { id: "image", name: "Image Tools", description: "Convert, resize, crop and compress images", icon: Image, colorClass: "text-tool-image", bgClass: "bg-tool-image/10" },
  { id: "document", name: "PDF & Documents", description: "Split, protect, unlock and edit PDF files", icon: FileText, colorClass: "text-tool-document", bgClass: "bg-tool-document/10" },
  { id: "audio", name: "Audio Tools", description: "Cut, join, record and analyse audio", icon: Music, colorClass: "text-tool-audio", bgClass: "bg-tool-audio/10" },
  { id: "video", name: "Video Tools", description: "Extract audio and create looping videos", icon: Video, colorClass: "text-tool-video", bgClass: "bg-tool-video/10" },
  { id: "text", name: "Text & Productivity", description: "Writing helpers, generators and timers", icon: Type, colorClass: "text-tool-text", bgClass: "bg-tool-text/10" },
  { id: "data", name: "Developer & Data", description: "JSON, encoding, hashing and web utilities", icon: Code, colorClass: "text-tool-code", bgClass: "bg-tool-code/10" },
  { id: "health", name: "Health & Fitness", description: "BMI, calories, BMR and wellness calculators", icon: HeartPulse, colorClass: "text-tool-health", bgClass: "bg-tool-health/10" },
  { id: "finance", name: "Finance Calculators", description: "Loans, investments, tax and salary maths", icon: Calculator, colorClass: "text-tool-finance", bgClass: "bg-tool-finance/10" },
];

export const tools: Tool[] = [
  // ============================================
  // 📂 FILE & IMAGE TOOLS (1-45)
  // ============================================
  
  // Image Converters
  { id: "jpg-to-png", name: "JPG to PNG Converter", description: "Convert JPG images to PNG format with transparency support", category: "image", icon: RefreshCw, from: "JPG", to: "PNG", popular: true, toolType: 'image-convert' },
  { id: "png-to-jpg", name: "PNG to JPG Converter", description: "Convert PNG images to JPG format for smaller file sizes", category: "image", icon: RefreshCw, from: "PNG", to: "JPG", popular: true, toolType: 'image-convert' },
  { id: "webp-to-jpg", name: "WebP to JPG Converter", description: "Convert WebP images to JPG format", category: "image", icon: RefreshCw, from: "WebP", to: "JPG", popular: true, toolType: 'image-convert' },
  { id: "webp-to-png", name: "WebP to PNG Converter", description: "Convert WebP images to PNG format", category: "image", icon: RefreshCw, from: "WebP", to: "PNG", toolType: 'image-convert' },
  { id: "pdf-splitter", name: "PDF Splitter", description: "Split PDF into separate pages or sections", category: "image", icon: Scissors, from: "PDF", to: "PDF", toolType: 'pdf' },
  { id: "pdf-unlocker", name: "PDF Unlocker", description: "Remove password protection from PDF", category: "image", icon: Unlock, from: "PDF", to: "PDF", toolType: 'pdf' },
  { id: "pdf-protect", name: "PDF Protect", description: "Add password protection to PDF files", category: "image", icon: Lock, from: "PDF", to: "PDF", toolType: 'pdf' },
  { id: "pdf-metadata", name: "PDF Metadata Editor", description: "Edit PDF title, author, and metadata", category: "image", icon: FileText, from: "PDF", to: "PDF", toolType: 'pdf' },
  
  // Image Editing Tools
  { id: "image-compressor", name: "Image Compressor", description: "Compress images without losing quality", category: "image", icon: Minimize2, from: "Image", to: "Compressed", popular: true, toolType: 'image-edit' },
  { id: "image-cropper", name: "Image Cropper", description: "Crop images to specific dimensions", category: "image", icon: Crop, from: "Image", to: "Cropped", toolType: 'image-edit' },
  { id: "bmp-to-jpg", name: "BMP to JPG Converter", description: "Convert BMP images to JPG", category: "image", icon: RefreshCw, from: "BMP", to: "JPG", toolType: 'image-convert' },
  { id: "watermark-image", name: "Watermark Image", description: "Add text or image watermark", category: "image", icon: Stamp, from: "Image", to: "Watermarked", toolType: 'image-edit' },
  { id: "meme-generator", name: "Meme Generator", description: "Create memes with custom text", category: "image", icon: Laugh, from: "Image", to: "Meme", popular: true, toolType: 'image-edit' },
  { id: "gradient-generator", name: "Gradient Generator", description: "Create beautiful CSS gradients", category: "image", icon: Droplet, from: "Colors", to: "Gradient", toolType: 'generator' },
  { id: "favicon-generator", name: "Favicon Generator", description: "Generate favicon from images", category: "image", icon: Square, from: "Image", to: "Favicon", toolType: 'image-edit' },

  // ============================================
  // 🎧 AUDIO TOOLS (46-75)
  // ============================================
  { id: "audio-cutter", name: "Audio Cutter", description: "Cut and trim audio files", category: "audio", icon: Scissors, from: "Audio", to: "Cut", popular: true, toolType: 'audio' },
  { id: "audio-joiner", name: "Audio Joiner", description: "Join multiple audio files together", category: "audio", icon: Layers, from: "Audio", to: "Joined", toolType: 'audio' },
  { id: "video-to-mp3", name: "Convert Video to MP3", description: "Extract audio from video files", category: "audio", icon: Music, from: "Video", to: "MP3", popular: true, toolType: 'audio' },
  { id: "text-to-speech", name: "Text to Speech", description: "Convert text to spoken audio", category: "audio", icon: Volume2, from: "Text", to: "Audio", popular: true, toolType: 'audio' },
  { id: "pitch-changer", name: "Audio Pitch Changer", description: "Change audio pitch up or down", category: "audio", icon: AudioLines, from: "Audio", to: "Pitch", toolType: 'audio' },
  { id: "waveform-visualizer", name: "Audio Waveform Visualizer", description: "Visualize audio waveforms", category: "audio", icon: AudioWaveform, from: "Audio", to: "Visual", toolType: 'audio' },
  { id: "audio-recorder", name: "Audio Recorder", description: "Record audio from microphone", category: "audio", icon: Mic, from: "Mic", to: "Audio", popular: true, toolType: 'audio' },
  { id: "frequency-detector", name: "Sound Frequency Detector", description: "Free online sound frequency detector & Hz meter – measure, identify, and analyze audio frequencies in real time with our browser-based frequency analyzer", category: "audio", icon: AudioLines, from: "Audio", to: "Hz", toolType: 'audio' },

  // ============================================
  // 🎥 VIDEO TOOLS (76-115)
  // ============================================
  { id: "extract-audio", name: "Extract Audio from Video", description: "Extract audio track from video", category: "video", icon: Music, from: "Video", to: "Audio", toolType: 'video' },
  { id: "boomerang-video", name: "Boomerang Video Maker", description: "Create boomerang loop videos", category: "video", icon: Repeat, from: "Video", to: "Boomerang", toolType: 'video' },

  // ============================================
  // 🧮 TEXT & WRITING TOOLS (116-155)
  // ============================================
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, and sentences", category: "text", icon: Hash, from: "Text", to: "Count", popular: true, toolType: 'text' },
  { id: "character-counter", name: "Character Counter", description: "Count characters with and without spaces", category: "text", icon: Hash, from: "Text", to: "Count", toolType: 'text' },
  { id: "sentence-case", name: "Sentence Case Converter", description: "Convert text to sentence case", category: "text", icon: CaseSensitive, from: "Text", to: "Sentence", toolType: 'text' },
  { id: "uppercase", name: "Uppercase Converter", description: "Convert text to UPPERCASE", category: "text", icon: CaseSensitive, from: "Text", to: "UPPER", popular: true, toolType: 'text' },
  { id: "lowercase", name: "Lowercase Converter", description: "Convert text to lowercase", category: "text", icon: CaseSensitive, from: "Text", to: "lower", toolType: 'text' },
  { id: "title-case", name: "Title Case Converter", description: "Convert Text To Title Case", category: "text", icon: CaseSensitive, from: "Text", to: "Title", toolType: 'text' },
  { id: "remove-line-breaks", name: "Remove Line Breaks", description: "Remove line breaks from text", category: "text", icon: AlignJustify, from: "Text", to: "Clean", toolType: 'text' },
  { id: "remove-spaces", name: "Remove Extra Spaces", description: "Remove extra spaces from text", category: "text", icon: AlignJustify, from: "Text", to: "Clean", toolType: 'text' },
  { id: "remove-duplicates", name: "Remove Duplicate Lines", description: "Remove duplicate lines from text", category: "text", icon: Copy, from: "Text", to: "Unique", toolType: 'text' },
  { id: "sort-text", name: "Sort Text Alphabetically", description: "Sort text lines alphabetically", category: "text", icon: List, from: "Text", to: "Sorted", toolType: 'text' },
  { id: "text-reverse", name: "Text Reverser", description: "Reverse text characters instantly", category: "text", icon: RotateCcw, from: "Text", to: "Reversed", toolType: 'text' },
  { id: "password-generator", name: "Random Password Generator", description: "Generate secure passwords", category: "text", icon: Key, from: "Options", to: "Password", popular: true, toolType: 'generator' },
  { id: "username-generator", name: "Random Username Generator", description: "Generate unique usernames", category: "text", icon: User, from: "Options", to: "Username", toolType: 'generator' },
  { id: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate Lorem Ipsum placeholder text", category: "text", icon: PilcrowSquare, from: "Options", to: "Lorem", toolType: 'text' },
  { id: "number-to-words", name: "Number to Words Converter", description: "Convert numbers to written words", category: "text", icon: Hash, from: "Number", to: "Words", toolType: 'text' },
  { id: "emoji-remover", name: "Emoji Remover", description: "Remove emojis from text", category: "text", icon: Trash2, from: "Text", to: "Clean", toolType: 'text' },
  { id: "case-swap", name: "Case Swap Tool", description: "Swap uppercase and lowercase letters", category: "text", icon: CaseSensitive, from: "Text", to: "Swapped", toolType: 'text' },
  { id: "blog-ideas", name: "Blog Idea Generator", description: "Generate blog post ideas", category: "text", icon: Sparkles, from: "Topic", to: "Ideas", toolType: 'generator' },
  { id: "caption-creator", name: "Social Media Caption Creator", description: "Create engaging social media captions", category: "text", icon: Smartphone, from: "Topic", to: "Caption", toolType: 'generator' },
  { id: "hashtag-generator", name: "Hashtag Generator", description: "Generate relevant hashtags", category: "text", icon: Hash, from: "Topic", to: "Hashtags", toolType: 'generator' },
  { id: "calendar-generator", name: "Calendar Generator", description: "Generate printable calendars", category: "text", icon: Calendar, from: "Options", to: "Calendar", toolType: 'generator' },
  { id: "pomodoro-timer", name: "Pomodoro Timer", description: "Advanced productivity timer with tasks, stats and themes", category: "text", icon: Timer, from: "Settings", to: "Timer", popular: true, toolType: 'text' },
  { id: "stopwatch", name: "Stopwatch", description: "Online stopwatch with lap times", category: "text", icon: Clock, from: "Start", to: "Time", toolType: 'text' },
  { id: "countdown-timer", name: "Countdown Timer", description: "Free online countdown timer & date countdown – count down to any date, event, New Year, wedding, birthday, exam or set custom minute/hour timers with alarm, fullscreen mode & shareable links", category: "text", icon: Timer, from: "Target", to: "Countdown", toolType: 'text' },
  { id: "typing-test", name: "Typing Speed Test", description: "Test your typing speed", category: "text", icon: TypeIcon, from: "Test", to: "WPM", popular: true, toolType: 'text' },
  { id: "paragraph-formatter", name: "Paragraph Formatter", description: "Format and clean up paragraphs", category: "text", icon: AlignLeft, from: "Text", to: "Formatted", toolType: 'text' },
  { id: "quote-generator", name: "Random Quote Generator", description: "Generate inspirational quotes", category: "text", icon: Quote, from: "Category", to: "Quote", toolType: 'generator' },
  { id: "lorem-generator", name: "Lorem Ipsum Generator", description: "Generate placeholder lorem ipsum text", category: "text", icon: AlignLeft, from: "Options", to: "Text", toolType: 'generator' },
  { id: "word-generator", name: "Random Word Generator", description: "Generate random words for writing and games", category: "text", icon: Shuffle, from: "Options", to: "Words", toolType: 'generator' },
  { id: "paragraph-generator", name: "Random Paragraph Generator", description: "Generate random paragraphs of text", category: "text", icon: Quote, from: "Options", to: "Paragraphs", toolType: 'generator' },

  // ============================================
  // 📊 DATA, CODE, & DEV TOOLS (156-185)
  // ============================================
  { id: "json-formatter", name: "JSON Formatter", description: "Format and beautify JSON data", category: "data", icon: Braces, from: "JSON", to: "Formatted", popular: true, toolType: 'data' },
  { id: "uuid-generator", name: "UUID Generator", description: "Generate random UUID v4 identifiers", category: "data", icon: Hash, from: "Options", to: "UUID", toolType: 'data' },
  { id: "json-validator", name: "JSON Validator", description: "Validate JSON syntax", category: "data", icon: Check, from: "JSON", to: "Valid", toolType: 'data' },
  { id: "json-to-csv", name: "JSON to CSV Converter", description: "Convert JSON to CSV format", category: "data", icon: RefreshCw, from: "JSON", to: "CSV", popular: true, toolType: 'data' },
  { id: "csv-to-json", name: "CSV to JSON Converter", description: "Convert CSV to JSON format", category: "data", icon: RefreshCw, from: "CSV", to: "JSON", toolType: 'data' },
  { id: "html-minifier", name: "HTML Minifier", description: "Minify HTML code", category: "data", icon: Minimize2, from: "HTML", to: "Minified", toolType: 'data' },
  { id: "css-minifier", name: "CSS Minifier", description: "Minify CSS code", category: "data", icon: Minimize2, from: "CSS", to: "Minified", toolType: 'data' },
  { id: "js-minifier", name: "JS Minifier", description: "Minify JavaScript code", category: "data", icon: Minimize2, from: "JS", to: "Minified", toolType: 'data' },
  { id: "base64-encoder", name: "Base64 Encoder", description: "Encode text to Base64", category: "data", icon: Lock, from: "Text", to: "Base64", toolType: 'data' },
  { id: "base64-decoder", name: "Base64 Decoder", description: "Decode Base64 to text", category: "data", icon: Unlock, from: "Base64", to: "Text", toolType: 'data' },
  { id: "url-encoder", name: "URL Encoder", description: "Encode URL special characters", category: "data", icon: Link, from: "URL", to: "Encoded", toolType: 'data' },
  { id: "url-decoder", name: "URL Decoder", description: "Decode URL encoded strings", category: "data", icon: Link, from: "Encoded", to: "URL", toolType: 'data' },
  { id: "md5-generator", name: "MD5 Hash Generator", description: "Generate MD5 hash", category: "data", icon: Key, from: "Text", to: "MD5", toolType: 'data' },
  { id: "sha256-generator", name: "SHA-256 Hash Generator", description: "Generate SHA-256 hash", category: "data", icon: Key, from: "Text", to: "SHA-256", toolType: 'data' },
  { id: "qr-generator", name: "QR Code Generator", description: "Generate QR codes from text or URL", category: "data", icon: QrCode, from: "Text", to: "QR", popular: true, toolType: 'generator' },
  { id: "qr-scanner", name: "QR Code Scanner", description: "Scan and read QR codes", category: "data", icon: QrCode, from: "QR", to: "Text", toolType: 'data' },
  { id: "regex-tester", name: "Regex Tester", description: "Test regular expressions", category: "data", icon: Regex, from: "Regex", to: "Match", toolType: 'data' },
  { id: "hex-to-rgb", name: "HEX to RGB Converter", description: "Convert HEX color to RGB", category: "data", icon: Palette, from: "HEX", to: "RGB", toolType: 'data' },
  { id: "rgb-to-hex", name: "RGB to HEX Converter", description: "Convert RGB color to HEX", category: "data", icon: Palette, from: "RGB", to: "HEX", toolType: 'data' },
  { id: "password-strength", name: "Password Strength Checker", description: "Check password security level", category: "data", icon: Shield, from: "Password", to: "Score", toolType: 'data' },
  { id: "ip-finder", name: "IP Address Finder", description: "Find your public IP address", category: "data", icon: Globe, from: "Request", to: "IP", toolType: 'data' },
  { id: "user-agent", name: "User Agent Detector", description: "Detect browser user agent", category: "data", icon: Info, from: "Browser", to: "UA", toolType: 'data' },
  { id: "screen-resolution", name: "Screen Resolution Checker", description: "Check screen resolution", category: "data", icon: MonitorPlay, from: "Screen", to: "Resolution", toolType: 'data' },

  // ============================================
  // 🫀 HEALTH & FITNESS TOOLS (186-200)
  // ============================================
  { id: "bmi-calculator", name: "BMI Calculator", description: "Calculate Body Mass Index", category: "health", icon: Scale, from: "Height/Weight", to: "BMI", popular: true, toolType: 'health' },
  { id: "love-calculator", name: "Love Calculator", description: "Fun couple compatibility and relationship score test", category: "health", icon: Heart, from: "Names", to: "Score", popular: true, toolType: 'health' },
  { id: "body-fat", name: "Body Fat Calculator", description: "Estimate body fat percentage", category: "health", icon: Activity, from: "Measurements", to: "Body Fat %", toolType: 'health' },
  { id: "calorie-calculator", name: "Calorie Calculator", description: "Calculate daily calorie needs", category: "health", icon: Cookie, from: "Activity", to: "Calories", popular: true, toolType: 'health' },
  { id: "bmr-calculator", name: "BMR Calculator", description: "Free BMR calculator — find your basal metabolic rate, resting calories and TDEE with the Mifflin-St Jeor formula", category: "health", icon: Activity, from: "Stats", to: "BMR", toolType: 'health' },
  { id: "water-intake", name: "Water Intake Calculator", description: "Calculate daily water intake", category: "health", icon: Droplets, from: "Weight", to: "Liters", toolType: 'health' },
  { id: "ideal-weight", name: "Ideal Weight Calculator", description: "Calculate ideal body weight", category: "health", icon: Scale, from: "Height", to: "Weight", toolType: 'health' },
  { id: "pregnancy-due", name: "Pregnancy Due Date Calculator", description: "Calculate expected due date", category: "health", icon: Baby, from: "LMP", to: "Due Date", toolType: 'health' },
  { id: "heart-rate-zone", name: "Heart Rate Zone Calculator", description: "Calculate heart rate training zones", category: "health", icon: HeartPulse, from: "Age", to: "Zones", toolType: 'health' },
  { id: "tdee-calculator", name: "TDEE Calculator", description: "Calculate Total Daily Energy Expenditure", category: "health", icon: Activity, from: "Stats", to: "TDEE", toolType: 'health' },
  { id: "sleep-calculator", name: "Sleep Calculator", description: "Calculate optimal sleep and wake times", category: "health", icon: Bed, from: "Time", to: "Schedule", toolType: 'health' },
  { id: "step-calorie", name: "Step-to-Calorie Calculator", description: "Convert steps to calories burned", category: "health", icon: Footprints, from: "Steps", to: "Calories", toolType: 'health' },
  { id: "waist-height", name: "Waist-to-Height Ratio Calculator", description: "Calculate waist-to-height ratio", category: "health", icon: Ruler, from: "Measurements", to: "Ratio", toolType: 'health' },

  // ============================================
  // 💰 FINANCE TOOLS (100 calculators)
  // ============================================

  // Loans & Mortgages (1-10)
  { id: "loan-emi", name: "EMI Calculator", description: "Calculate loan EMI, interest & total payment instantly", category: "finance", icon: Calculator, from: "Loan", to: "EMI", popular: true, toolType: 'finance' },
  { id: "mortgage-calculator", name: "Mortgage Calculator", description: "Estimate full mortgage PITI: principal, interest, tax & insurance", category: "finance", icon: Calculator, from: "Home", to: "PITI", popular: true, toolType: 'finance' },
  { id: "home-loan-emi", name: "Home Loan EMI Calculator", description: "Calculate home loan EMI with total interest & repayment", category: "finance", icon: Calculator, from: "Loan", to: "EMI", popular: true, toolType: 'finance' },
  { id: "car-loan-emi", name: "Car Loan EMI Calculator", description: "Auto loan monthly payment calculator", category: "finance", icon: Calculator, from: "Loan", to: "EMI", toolType: 'finance' },
  { id: "personal-loan-emi", name: "Personal Loan EMI Calculator", description: "Personal loan EMI & total interest calculator", category: "finance", icon: Calculator, from: "Loan", to: "EMI", toolType: 'finance' },
  { id: "student-loan-calculator", name: "Student Loan Calculator", description: "Calculate student loan monthly payments & interest", category: "finance", icon: Calculator, from: "Loan", to: "EMI", toolType: 'finance' },
  { id: "credit-card-payoff", name: "Credit Card Payoff Calculator", description: "Find how fast you can pay off credit card debt", category: "finance", icon: Calculator, from: "Balance", to: "Months", popular: true, toolType: 'finance' },
  { id: "credit-card-min-payment", name: "Credit Card Min Payment Calculator", description: "Calculate minimum payment & true payoff time", category: "finance", icon: Calculator, from: "Balance", to: "Min Pay", toolType: 'finance' },
  { id: "simple-interest", name: "Simple Interest Calculator", description: "Calculate simple interest on principal", category: "finance", icon: Percent, from: "Principal", to: "Interest", popular: true, toolType: 'finance' },
  { id: "compound-interest", name: "Compound Interest Calculator", description: "Calculate compound interest & future value", category: "finance", icon: TrendingUp, from: "Principal", to: "Future Value", popular: true, toolType: 'finance' },

  // Rates & Returns (11-16)
  { id: "apr-calculator", name: "APR Calculator", description: "Calculate true Annual Percentage Rate with fees", category: "finance", icon: Percent, from: "Loan", to: "APR", toolType: 'finance' },
  { id: "apy-calculator", name: "APY Calculator", description: "Calculate Annual Percentage Yield from nominal rate", category: "finance", icon: Percent, from: "APR", to: "APY", toolType: 'finance' },
  { id: "cagr-calculator", name: "CAGR Calculator", description: "Compound Annual Growth Rate calculator", category: "finance", icon: TrendingUp, from: "Returns", to: "CAGR", popular: true, toolType: 'finance' },
  { id: "roi-calculator", name: "ROI Calculator", description: "Return on Investment calculator with profit", category: "finance", icon: TrendingUp, from: "Investment", to: "ROI", popular: true, toolType: 'finance' },
  { id: "irr-calculator", name: "IRR Calculator", description: "Internal Rate of Return from cash flows", category: "finance", icon: TrendingUp, from: "Cash Flows", to: "IRR", toolType: 'finance' },
  { id: "npv-calculator", name: "NPV Calculator", description: "Net Present Value from cash flow stream", category: "finance", icon: Calculator, from: "Cash Flows", to: "NPV", toolType: 'finance' },

  // Deposits & Savings (17-19)
  { id: "fd-calculator", name: "FD Calculator", description: "Fixed Deposit maturity & interest calculator", category: "finance", icon: Calculator, from: "Deposit", to: "Maturity", popular: true, toolType: 'finance' },
  { id: "rd-calculator", name: "RD Calculator", description: "Recurring Deposit maturity calculator", category: "finance", icon: Calculator, from: "Monthly", to: "Maturity", toolType: 'finance' },
  { id: "ppf-calculator", name: "PPF Calculator", description: "Public Provident Fund 15-year maturity calculator", category: "finance", icon: Calculator, from: "Deposit", to: "Maturity", toolType: 'finance' },

  // Investments (20-25)
  { id: "sip-calculator", name: "SIP Calculator", description: "Mutual Fund SIP future value & wealth gain", category: "finance", icon: TrendingUp, from: "Monthly", to: "Future Value", popular: true, toolType: 'finance' },
  { id: "lumpsum-calculator", name: "Lumpsum Calculator", description: "One-time investment future value calculator", category: "finance", icon: TrendingUp, from: "Lumpsum", to: "Future Value", toolType: 'finance' },
  { id: "mutual-fund-returns", name: "Mutual Fund Returns Calculator", description: "Track mutual fund profit/loss from NAV", category: "finance", icon: TrendingUp, from: "NAV", to: "Returns", toolType: 'finance' },
  { id: "swp-calculator", name: "SWP Calculator", description: "Systematic Withdrawal Plan remaining corpus", category: "finance", icon: Calculator, from: "Corpus", to: "Withdrawal", toolType: 'finance' },
  { id: "step-up-sip", name: "Step-up SIP Calculator", description: "SIP with yearly increment future value", category: "finance", icon: TrendingUp, from: "SIP", to: "Future Value", toolType: 'finance' },
  { id: "nps-calculator", name: "NPS Calculator", description: "National Pension Scheme corpus & pension", category: "finance", icon: Calculator, from: "Contribution", to: "Pension", toolType: 'finance' },

  // Retirement (26-29)
  { id: "epf-calculator", name: "EPF Calculator", description: "Employee Provident Fund maturity calculator", category: "finance", icon: Calculator, from: "Salary", to: "EPF", toolType: 'finance' },
  { id: "gratuity-calculator", name: "Gratuity Calculator", description: "End-of-service gratuity payment calculator", category: "finance", icon: Calculator, from: "Salary", to: "Gratuity", toolType: 'finance' },
  { id: "retirement-corpus", name: "Retirement Corpus Calculator", description: "How much you need to retire comfortably", category: "finance", icon: Calculator, from: "Expense", to: "Corpus", popular: true, toolType: 'finance' },
  { id: "inflation-calculator", name: "Inflation Calculator", description: "See future cost & buying power of money", category: "finance", icon: TrendingUp, from: "Today", to: "Future", toolType: 'finance' },

  // Time Value of Money (30-33)
  { id: "future-value", name: "Future Value Calculator", description: "Calculate future value of money over time", category: "finance", icon: TrendingUp, from: "PV", to: "FV", toolType: 'finance' },
  { id: "present-value", name: "Present Value Calculator", description: "Discount future cash to today's value", category: "finance", icon: Calculator, from: "FV", to: "PV", toolType: 'finance' },
  { id: "annuity-calculator", name: "Annuity Calculator", description: "Annuity present value & future value", category: "finance", icon: Calculator, from: "Payment", to: "PV/FV", toolType: 'finance' },
  { id: "perpetuity-calculator", name: "Perpetuity Calculator", description: "Calculate present value of perpetual cash flow", category: "finance", icon: Calculator, from: "Cash Flow", to: "PV", toolType: 'finance' },

  // Bonds (34-37)
  { id: "bond-price", name: "Bond Price Calculator", description: "Calculate fair bond price from YTM", category: "finance", icon: Calculator, from: "YTM", to: "Price", toolType: 'finance' },
  { id: "bond-yield", name: "Bond Yield Calculator", description: "Current yield from coupon & price", category: "finance", icon: Percent, from: "Price", to: "Yield", toolType: 'finance' },
  { id: "ytm-calculator", name: "YTM Calculator", description: "Yield to Maturity approximate calculator", category: "finance", icon: Percent, from: "Bond", to: "YTM", toolType: 'finance' },
  { id: "dividend-yield", name: "Dividend Yield Calculator", description: "Calculate stock dividend yield percentage", category: "finance", icon: Percent, from: "Dividend", to: "Yield", toolType: 'finance' },

  // Stocks (38-46)
  { id: "dividend-discount-model", name: "Dividend Discount Model Calculator", description: "Gordon Growth Model fair price of stock", category: "finance", icon: Calculator, from: "Dividend", to: "Price", toolType: 'finance' },
  { id: "stock-profit", name: "Stock Profit Calculator", description: "Calculate stock trade profit, loss & return", category: "finance", icon: TrendingUp, from: "Trade", to: "P&L", popular: true, toolType: 'finance' },
  { id: "stock-average", name: "Stock Average Calculator", description: "Calculate average buy price after multiple buys", category: "finance", icon: Calculator, from: "Buys", to: "Average", toolType: 'finance' },
  { id: "stock-target-price", name: "Stock Target Price Calculator", description: "Target price from EPS and PE multiple", category: "finance", icon: Calculator, from: "EPS", to: "Target", toolType: 'finance' },
  { id: "pe-ratio", name: "P/E Ratio Calculator", description: "Price to Earnings ratio of a stock", category: "finance", icon: Calculator, from: "Price/EPS", to: "PE", toolType: 'finance' },
  { id: "pb-ratio", name: "P/B Ratio Calculator", description: "Price to Book ratio calculator", category: "finance", icon: Calculator, from: "Price/Book", to: "PB", toolType: 'finance' },
  { id: "eps-calculator", name: "EPS Calculator", description: "Earnings Per Share calculator", category: "finance", icon: Calculator, from: "Income", to: "EPS", toolType: 'finance' },
  { id: "market-cap", name: "Market Cap Calculator", description: "Calculate company market capitalization", category: "finance", icon: Calculator, from: "Shares", to: "Cap", toolType: 'finance' },
  { id: "book-value", name: "Book Value Per Share Calculator", description: "Equity book value per share calculator", category: "finance", icon: Calculator, from: "Equity", to: "BVPS", toolType: 'finance' },

  // Financial Ratios (47-53)
  { id: "debt-to-equity", name: "Debt to Equity Ratio Calculator", description: "D/E ratio leverage calculator", category: "finance", icon: Calculator, from: "Debt", to: "D/E", toolType: 'finance' },
  { id: "current-ratio", name: "Current Ratio Calculator", description: "Liquidity current ratio calculator", category: "finance", icon: Calculator, from: "CA/CL", to: "Ratio", toolType: 'finance' },
  { id: "quick-ratio", name: "Quick Ratio Calculator", description: "Acid-test quick ratio liquidity calculator", category: "finance", icon: Calculator, from: "Assets", to: "Quick", toolType: 'finance' },
  { id: "working-capital", name: "Working Capital Calculator", description: "Net working capital calculator", category: "finance", icon: Calculator, from: "CA−CL", to: "WC", toolType: 'finance' },
  { id: "gross-margin", name: "Gross Margin Calculator", description: "Gross profit margin percentage", category: "finance", icon: Percent, from: "Rev−COGS", to: "Margin", toolType: 'finance' },
  { id: "operating-margin", name: "Operating Margin Calculator", description: "Operating profit margin percentage", category: "finance", icon: Percent, from: "OpInc/Rev", to: "Margin", toolType: 'finance' },
  { id: "net-margin", name: "Net Profit Margin Calculator", description: "Net profit margin percentage", category: "finance", icon: Percent, from: "NI/Rev", to: "Margin", toolType: 'finance' },

  // Business (54-60)
  { id: "break-even", name: "Break-Even Calculator", description: "Break-even units & revenue calculator", category: "finance", icon: Calculator, from: "Costs", to: "BE Units", popular: true, toolType: 'finance' },
  { id: "markup-calculator", name: "Markup Calculator", description: "Selling price from cost and markup", category: "finance", icon: Percent, from: "Cost", to: "Price", toolType: 'finance' },
  { id: "discount-calculator", name: "Discount Calculator", description: "Sale price and savings calculator", category: "finance", icon: Percent, from: "Price", to: "Final", popular: true, toolType: 'finance' },
  { id: "tip-calculator", name: "Tip Calculator", description: "Restaurant tip & bill split calculator", category: "finance", icon: Calculator, from: "Bill", to: "Tip", popular: true, toolType: 'finance' },
  { id: "sales-tax", name: "Sales Tax Calculator", description: "Sales tax & total amount calculator", category: "finance", icon: Percent, from: "Amount", to: "Tax", toolType: 'finance' },
  { id: "vat-calculator", name: "VAT Calculator", description: "Value Added Tax calculator", category: "finance", icon: Percent, from: "Amount", to: "VAT", toolType: 'finance' },
  { id: "gst-calculator", name: "GST Calculator", description: "GST add or remove calculator", category: "finance", icon: Percent, from: "Amount", to: "GST", popular: true, toolType: 'finance' },

  // Income Tax (61-63)
  { id: "income-tax-india", name: "Income Tax Calculator India", description: "Indian income tax (new regime FY24-25)", category: "finance", icon: Calculator, from: "Income", to: "Tax", popular: true, toolType: 'finance' },
  { id: "income-tax-us", name: "Income Tax Calculator USA", description: "US federal income tax 2024 brackets", category: "finance", icon: Calculator, from: "Income", to: "Tax", toolType: 'finance' },
  { id: "capital-gains-tax", name: "Capital Gains Tax Calculator", description: "Capital gains tax on trade calculator", category: "finance", icon: Calculator, from: "Gain", to: "Tax", toolType: 'finance' },

  // Salary & Payroll (64-72)
  { id: "paycheck-calculator", name: "Paycheck Calculator", description: "Net pay after federal, state & FICA", category: "finance", icon: DollarSign, from: "Gross", to: "Net", popular: true, toolType: 'finance' },
  { id: "salary-hike", name: "Salary Hike Calculator", description: "Calculate salary hike percentage", category: "finance", icon: Percent, from: "Old/New", to: "Hike", toolType: 'finance' },
  { id: "hourly-to-salary", name: "Hourly to Salary Calculator", description: "Convert hourly wage to annual salary", category: "finance", icon: Calculator, from: "Hourly", to: "Salary", toolType: 'finance' },
  { id: "salary-to-hourly", name: "Salary to Hourly Calculator", description: "Convert annual salary to hourly rate", category: "finance", icon: Calculator, from: "Salary", to: "Hourly", toolType: 'finance' },
  { id: "overtime-pay", name: "Overtime Pay Calculator", description: "Calculate overtime wage with multiplier", category: "finance", icon: Calculator, from: "Hours", to: "OT Pay", toolType: 'finance' },
  { id: "take-home-salary", name: "Take-Home Salary Calculator", description: "In-hand salary after PF & tax deductions", category: "finance", icon: DollarSign, from: "CTC", to: "In-Hand", popular: true, toolType: 'finance' },
  { id: "tax-bracket-us", name: "US Tax Bracket Calculator", description: "Find your marginal US tax bracket", category: "finance", icon: Calculator, from: "Income", to: "Bracket", toolType: 'finance' },
  { id: "social-security-tax", name: "Social Security Tax Calculator", description: "Social Security tax (6.2%) calculator", category: "finance", icon: Calculator, from: "Wage", to: "SS Tax", toolType: 'finance' },
  { id: "medicare-tax", name: "Medicare Tax Calculator", description: "Medicare tax with additional 0.9% threshold", category: "finance", icon: Calculator, from: "Wage", to: "Tax", toolType: 'finance' },
  { id: "fica-calculator", name: "FICA Tax Calculator", description: "FICA: Social Security + Medicare calculator", category: "finance", icon: Calculator, from: "Wage", to: "FICA", toolType: 'finance' },
  { id: "self-employment-tax", name: "Self-Employment Tax Calculator", description: "SE tax (15.3%) for freelancers calculator", category: "finance", icon: Calculator, from: "Net Inc", to: "SE Tax", toolType: 'finance' },
  { id: "property-tax", name: "Property Tax Calculator", description: "Annual property tax calculator", category: "finance", icon: Calculator, from: "Value", to: "Tax", toolType: 'finance' },

  // Real Estate (76-80)
  { id: "rent-vs-buy", name: "Rent vs Buy Calculator", description: "Compare renting vs buying a home", category: "finance", icon: Calculator, from: "Rent/Buy", to: "Verdict", popular: true, toolType: 'finance' },
  { id: "rental-yield", name: "Rental Yield Calculator", description: "Gross rental yield percentage calculator", category: "finance", icon: Percent, from: "Rent", to: "Yield", toolType: 'finance' },
  { id: "cap-rate", name: "Cap Rate Calculator", description: "Real estate capitalization rate calculator", category: "finance", icon: Percent, from: "NOI", to: "Cap Rate", toolType: 'finance' },
  { id: "cash-on-cash-return", name: "Cash-on-Cash Return Calculator", description: "Real estate cash-on-cash ROI calculator", category: "finance", icon: Percent, from: "Cash", to: "CoC", toolType: 'finance' },
  { id: "gross-rent-multiplier", name: "Gross Rent Multiplier Calculator", description: "GRM real estate valuation calculator", category: "finance", icon: Calculator, from: "Price", to: "GRM", toolType: 'finance' },

  // Debt Strategy (81-86)
  { id: "mortgage-refinance", name: "Mortgage Refinance Calculator", description: "Refinance savings & break-even calculator", category: "finance", icon: Calculator, from: "Old/New", to: "Savings", toolType: 'finance' },
  { id: "loan-prepayment", name: "Loan Prepayment Calculator", description: "Extra payment payoff time saver", category: "finance", icon: Calculator, from: "Extra", to: "Months Saved", toolType: 'finance' },
  { id: "loan-amortization", name: "Loan Amortization Calculator", description: "EMI, year-1 interest & total interest calculator", category: "finance", icon: Calculator, from: "Loan", to: "Schedule", toolType: 'finance' },
  { id: "debt-snowball", name: "Debt Snowball Calculator", description: "Smallest-balance-first payoff strategy", category: "finance", icon: Calculator, from: "Debts", to: "Order", toolType: 'finance' },
  { id: "debt-avalanche", name: "Debt Avalanche Calculator", description: "Highest-APR-first payoff strategy", category: "finance", icon: Calculator, from: "Debts", to: "Order", toolType: 'finance' },
  { id: "debt-to-income", name: "Debt-to-Income Ratio Calculator", description: "DTI ratio for loan approvals", category: "finance", icon: Percent, from: "Debt/Income", to: "DTI", toolType: 'finance' },

  // Wealth Goals (87-91)
  { id: "savings-goal", name: "Savings Goal Calculator", description: "Monthly saving needed to hit a goal", category: "finance", icon: Calculator, from: "Goal", to: "Monthly", popular: true, toolType: 'finance' },
  { id: "emergency-fund", name: "Emergency Fund Calculator", description: "Recommended emergency fund target", category: "finance", icon: Calculator, from: "Expense", to: "Target", toolType: 'finance' },
  { id: "millionaire-calculator", name: "Millionaire Calculator", description: "Years to reach 1 million dollars", category: "finance", icon: TrendingUp, from: "Save", to: "Years", toolType: 'finance' },
  { id: "coast-fire", name: "Coast FIRE Calculator", description: "Coast FIRE number for early retirement", category: "finance", icon: Calculator, from: "Expense", to: "Coast", toolType: 'finance' },
  { id: "fire-number", name: "FIRE Number Calculator", description: "Financial Independence target (25× rule)", category: "finance", icon: Calculator, from: "Expense", to: "FIRE", toolType: 'finance' },

  // Currency & Crypto (92-95)
  { id: "currency-converter", name: "Currency Converter Calculator", description: "Manual currency converter with custom rate", category: "finance", icon: RefreshCw, from: "Currency", to: "Currency", toolType: 'finance' },
  { id: "currency-strength", name: "Currency Strength Calculator", description: "Calculate % change between FX rates", category: "finance", icon: TrendingUp, from: "Rates", to: "Change", toolType: 'finance' },
  { id: "cryptocurrency-profit", name: "Cryptocurrency Profit Calculator", description: "Crypto trade profit, loss & return calculator", category: "finance", icon: TrendingUp, from: "Trade", to: "P&L", popular: true, toolType: 'finance' },
  { id: "crypto-staking-rewards", name: "Crypto Staking Rewards Calculator", description: "Estimate staking APY rewards", category: "finance", icon: TrendingUp, from: "Stake", to: "Rewards", toolType: 'finance' },

  // Misc (96-100)
  { id: "tax-deduction", name: "Tax Deduction Savings Calculator", description: "Tax saved from a deduction", category: "finance", icon: Calculator, from: "Deduction", to: "Saved", toolType: 'finance' },
  { id: "payroll-deduction", name: "Payroll Deduction Calculator", description: "Pre-tax payroll deduction calculator", category: "finance", icon: Calculator, from: "Gross", to: "Taxable", toolType: 'finance' },
  { id: "tip-split", name: "Tip Split Calculator", description: "Split bill, tip & per-person share", category: "finance", icon: Calculator, from: "Bill", to: "Split", toolType: 'finance' },
  { id: "cost-of-living-adjustment", name: "Cost of Living Adjustment Calculator", description: "COLA salary adjustment from CPI", category: "finance", icon: Calculator, from: "Salary", to: "COLA", toolType: 'finance' },
  { id: "inflation-adjusted-return", name: "Inflation-Adjusted Return Calculator", description: "Real return after inflation calculator", category: "finance", icon: Percent, from: "Nominal", to: "Real", toolType: 'finance' },
];

export const getToolsByCategory = (category: ToolCategory): Tool[] => {
  return tools.filter(tool => tool.category === category);
};

export const getPopularTools = (): Tool[] => {
  return tools.filter(tool => tool.popular);
};

export const searchTools = (query: string): Tool[] => {
  const lowerQuery = query.toLowerCase();
  return tools.filter(
    tool =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.from.toLowerCase().includes(lowerQuery) ||
      tool.to.toLowerCase().includes(lowerQuery)
  );
};

export const getToolById = (id: string): Tool | undefined => {
  return tools.find(tool => tool.id === id);
};

export const getCategoryById = (id: ToolCategory): CategoryInfo | undefined => {
  return categories.find(cat => cat.id === id);
};
