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
}

export type ToolCategory = 
  | "image" 
  | "document" 
  | "audio" 
  | "video" 
  | "archive" 
  | "code" 
  | "data" 
  | "text";

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export const categories: CategoryInfo[] = [
  { id: "image", name: "Image Tools", description: "Convert, resize, compress images", icon: Image, colorClass: "text-tool-image", bgClass: "bg-tool-image/10" },
  { id: "document", name: "Document Tools", description: "PDF, Word, Excel conversions", icon: FileText, colorClass: "text-tool-document", bgClass: "bg-tool-document/10" },
  { id: "audio", name: "Audio Tools", description: "Convert and edit audio files", icon: Music, colorClass: "text-tool-audio", bgClass: "bg-tool-audio/10" },
  { id: "video", name: "Video Tools", description: "Video conversion and editing", icon: Video, colorClass: "text-tool-video", bgClass: "bg-tool-video/10" },
  { id: "archive", name: "Archive Tools", description: "Compress and extract files", icon: Archive, colorClass: "text-tool-archive", bgClass: "bg-tool-archive/10" },
  { id: "code", name: "Developer Tools", description: "Code formatting and conversion", icon: Code, colorClass: "text-tool-code", bgClass: "bg-tool-code/10" },
  { id: "data", name: "Data Tools", description: "Data conversion and manipulation", icon: Database, colorClass: "text-tool-data", bgClass: "bg-tool-data/10" },
  { id: "text", name: "Text Tools", description: "Text manipulation utilities", icon: Type, colorClass: "text-tool-text", bgClass: "bg-tool-text/10" },
];

export const tools: Tool[] = [
  // Image Converters (25 tools)
  { id: "jpg-to-png", name: "JPG to PNG", description: "Convert JPG images to PNG format with transparency support", category: "image", icon: RefreshCw, from: "JPG", to: "PNG", popular: true },
  { id: "png-to-jpg", name: "PNG to JPG", description: "Convert PNG images to JPG format for smaller file sizes", category: "image", icon: RefreshCw, from: "PNG", to: "JPG", popular: true },
  { id: "webp-to-png", name: "WebP to PNG", description: "Convert WebP images to PNG format", category: "image", icon: RefreshCw, from: "WebP", to: "PNG", popular: true },
  { id: "png-to-webp", name: "PNG to WebP", description: "Convert PNG to WebP for better compression", category: "image", icon: RefreshCw, from: "PNG", to: "WebP" },
  { id: "jpg-to-webp", name: "JPG to WebP", description: "Convert JPG to WebP format", category: "image", icon: RefreshCw, from: "JPG", to: "WebP" },
  { id: "webp-to-jpg", name: "WebP to JPG", description: "Convert WebP images to JPG", category: "image", icon: RefreshCw, from: "WebP", to: "JPG" },
  { id: "gif-to-png", name: "GIF to PNG", description: "Extract frames or convert GIF to PNG", category: "image", icon: RefreshCw, from: "GIF", to: "PNG" },
  { id: "png-to-gif", name: "PNG to GIF", description: "Convert PNG images to GIF format", category: "image", icon: RefreshCw, from: "PNG", to: "GIF" },
  { id: "bmp-to-png", name: "BMP to PNG", description: "Convert BMP images to PNG", category: "image", icon: RefreshCw, from: "BMP", to: "PNG" },
  { id: "png-to-bmp", name: "PNG to BMP", description: "Convert PNG to BMP format", category: "image", icon: RefreshCw, from: "PNG", to: "BMP" },
  { id: "tiff-to-jpg", name: "TIFF to JPG", description: "Convert TIFF images to JPG", category: "image", icon: RefreshCw, from: "TIFF", to: "JPG" },
  { id: "jpg-to-tiff", name: "JPG to TIFF", description: "Convert JPG to TIFF format", category: "image", icon: RefreshCw, from: "JPG", to: "TIFF" },
  { id: "svg-to-png", name: "SVG to PNG", description: "Rasterize SVG to PNG image", category: "image", icon: RefreshCw, from: "SVG", to: "PNG", popular: true },
  { id: "png-to-svg", name: "PNG to SVG", description: "Vectorize PNG to SVG format", category: "image", icon: RefreshCw, from: "PNG", to: "SVG" },
  { id: "heic-to-jpg", name: "HEIC to JPG", description: "Convert iPhone HEIC photos to JPG", category: "image", icon: RefreshCw, from: "HEIC", to: "JPG", popular: true },
  { id: "heic-to-png", name: "HEIC to PNG", description: "Convert HEIC to PNG format", category: "image", icon: RefreshCw, from: "HEIC", to: "PNG" },
  { id: "ico-to-png", name: "ICO to PNG", description: "Convert icon files to PNG", category: "image", icon: RefreshCw, from: "ICO", to: "PNG" },
  { id: "png-to-ico", name: "PNG to ICO", description: "Create icon files from PNG", category: "image", icon: RefreshCw, from: "PNG", to: "ICO" },
  { id: "image-resize", name: "Image Resizer", description: "Resize images to any dimension", category: "image", icon: Maximize2, from: "Any", to: "Resized" },
  { id: "image-compress", name: "Image Compressor", description: "Compress images without quality loss", category: "image", icon: Minimize2, from: "Any", to: "Compressed", popular: true },
  { id: "image-crop", name: "Image Cropper", description: "Crop images to specific dimensions", category: "image", icon: Crop, from: "Any", to: "Cropped" },
  { id: "image-rotate", name: "Image Rotator", description: "Rotate images by any angle", category: "image", icon: RotateCw, from: "Any", to: "Rotated" },
  { id: "image-flip", name: "Image Flipper", description: "Flip images horizontally or vertically", category: "image", icon: FlipHorizontal, from: "Any", to: "Flipped" },
  { id: "remove-bg", name: "Background Remover", description: "Remove image backgrounds automatically", category: "image", icon: Eraser, from: "Any", to: "Transparent", popular: true },
  { id: "color-picker", name: "Color Picker", description: "Extract colors from any image", category: "image", icon: Palette, from: "Image", to: "Colors" },

  // Document Converters (20 tools)
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF documents to editable Word files", category: "document", icon: RefreshCw, from: "PDF", to: "DOCX", popular: true },
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert Word documents to PDF", category: "document", icon: RefreshCw, from: "DOCX", to: "PDF", popular: true },
  { id: "pdf-to-excel", name: "PDF to Excel", description: "Extract tables from PDF to Excel", category: "document", icon: RefreshCw, from: "PDF", to: "XLSX" },
  { id: "excel-to-pdf", name: "Excel to PDF", description: "Convert Excel spreadsheets to PDF", category: "document", icon: RefreshCw, from: "XLSX", to: "PDF" },
  { id: "pdf-to-ppt", name: "PDF to PowerPoint", description: "Convert PDF to editable presentations", category: "document", icon: RefreshCw, from: "PDF", to: "PPTX" },
  { id: "ppt-to-pdf", name: "PowerPoint to PDF", description: "Convert presentations to PDF", category: "document", icon: RefreshCw, from: "PPTX", to: "PDF" },
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF pages to JPG images", category: "document", icon: RefreshCw, from: "PDF", to: "JPG", popular: true },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Combine JPG images into PDF", category: "document", icon: RefreshCw, from: "JPG", to: "PDF", popular: true },
  { id: "pdf-to-png", name: "PDF to PNG", description: "Convert PDF pages to PNG images", category: "document", icon: RefreshCw, from: "PDF", to: "PNG" },
  { id: "png-to-pdf", name: "PNG to PDF", description: "Create PDF from PNG images", category: "document", icon: RefreshCw, from: "PNG", to: "PDF" },
  { id: "pdf-merge", name: "Merge PDF", description: "Combine multiple PDFs into one", category: "document", icon: Layers, from: "PDF", to: "PDF", popular: true },
  { id: "pdf-split", name: "Split PDF", description: "Split PDF into separate pages", category: "document", icon: Scissors, from: "PDF", to: "PDF" },
  { id: "pdf-compress", name: "Compress PDF", description: "Reduce PDF file size", category: "document", icon: Minimize2, from: "PDF", to: "PDF", popular: true },
  { id: "pdf-unlock", name: "Unlock PDF", description: "Remove PDF password protection", category: "document", icon: Unlock, from: "PDF", to: "PDF" },
  { id: "pdf-protect", name: "Protect PDF", description: "Add password to PDF files", category: "document", icon: Lock, from: "PDF", to: "PDF" },
  { id: "html-to-pdf", name: "HTML to PDF", description: "Convert web pages to PDF", category: "document", icon: RefreshCw, from: "HTML", to: "PDF" },
  { id: "markdown-to-pdf", name: "Markdown to PDF", description: "Convert Markdown to PDF", category: "document", icon: RefreshCw, from: "MD", to: "PDF" },
  { id: "txt-to-pdf", name: "Text to PDF", description: "Convert plain text to PDF", category: "document", icon: RefreshCw, from: "TXT", to: "PDF" },
  { id: "pdf-to-txt", name: "PDF to Text", description: "Extract text from PDF files", category: "document", icon: RefreshCw, from: "PDF", to: "TXT" },
  { id: "ocr-pdf", name: "OCR PDF", description: "Extract text from scanned PDFs", category: "document", icon: Eye, from: "PDF", to: "Text" },

  // Audio Tools (15 tools)
  { id: "mp3-to-wav", name: "MP3 to WAV", description: "Convert MP3 audio to WAV format", category: "audio", icon: RefreshCw, from: "MP3", to: "WAV", popular: true },
  { id: "wav-to-mp3", name: "WAV to MP3", description: "Convert WAV audio to MP3", category: "audio", icon: RefreshCw, from: "WAV", to: "MP3", popular: true },
  { id: "m4a-to-mp3", name: "M4A to MP3", description: "Convert M4A audio to MP3", category: "audio", icon: RefreshCw, from: "M4A", to: "MP3" },
  { id: "mp3-to-m4a", name: "MP3 to M4A", description: "Convert MP3 to M4A format", category: "audio", icon: RefreshCw, from: "MP3", to: "M4A" },
  { id: "flac-to-mp3", name: "FLAC to MP3", description: "Convert FLAC to MP3", category: "audio", icon: RefreshCw, from: "FLAC", to: "MP3" },
  { id: "mp3-to-flac", name: "MP3 to FLAC", description: "Convert MP3 to lossless FLAC", category: "audio", icon: RefreshCw, from: "MP3", to: "FLAC" },
  { id: "ogg-to-mp3", name: "OGG to MP3", description: "Convert OGG Vorbis to MP3", category: "audio", icon: RefreshCw, from: "OGG", to: "MP3" },
  { id: "mp3-to-ogg", name: "MP3 to OGG", description: "Convert MP3 to OGG format", category: "audio", icon: RefreshCw, from: "MP3", to: "OGG" },
  { id: "aac-to-mp3", name: "AAC to MP3", description: "Convert AAC audio to MP3", category: "audio", icon: RefreshCw, from: "AAC", to: "MP3" },
  { id: "mp3-to-aac", name: "MP3 to AAC", description: "Convert MP3 to AAC format", category: "audio", icon: RefreshCw, from: "MP3", to: "AAC" },
  { id: "audio-trim", name: "Audio Trimmer", description: "Trim audio files to specific length", category: "audio", icon: Scissors, from: "Audio", to: "Trimmed" },
  { id: "audio-merge", name: "Audio Merger", description: "Combine multiple audio files", category: "audio", icon: Layers, from: "Audio", to: "Merged" },
  { id: "audio-volume", name: "Volume Booster", description: "Increase or decrease audio volume", category: "audio", icon: Volume2, from: "Audio", to: "Adjusted" },
  { id: "audio-normalize", name: "Audio Normalizer", description: "Normalize audio levels", category: "audio", icon: Sliders, from: "Audio", to: "Normalized" },
  { id: "audio-compress", name: "Audio Compressor", description: "Reduce audio file size", category: "audio", icon: Minimize2, from: "Audio", to: "Compressed" },

  // Video Tools (15 tools)
  { id: "mp4-to-mp3", name: "MP4 to MP3", description: "Extract audio from video", category: "video", icon: Music, from: "MP4", to: "MP3", popular: true },
  { id: "mp4-to-avi", name: "MP4 to AVI", description: "Convert MP4 to AVI format", category: "video", icon: RefreshCw, from: "MP4", to: "AVI" },
  { id: "avi-to-mp4", name: "AVI to MP4", description: "Convert AVI to MP4", category: "video", icon: RefreshCw, from: "AVI", to: "MP4" },
  { id: "mov-to-mp4", name: "MOV to MP4", description: "Convert QuickTime MOV to MP4", category: "video", icon: RefreshCw, from: "MOV", to: "MP4", popular: true },
  { id: "mp4-to-mov", name: "MP4 to MOV", description: "Convert MP4 to MOV format", category: "video", icon: RefreshCw, from: "MP4", to: "MOV" },
  { id: "mkv-to-mp4", name: "MKV to MP4", description: "Convert MKV to MP4", category: "video", icon: RefreshCw, from: "MKV", to: "MP4" },
  { id: "mp4-to-mkv", name: "MP4 to MKV", description: "Convert MP4 to MKV format", category: "video", icon: RefreshCw, from: "MP4", to: "MKV" },
  { id: "webm-to-mp4", name: "WebM to MP4", description: "Convert WebM to MP4", category: "video", icon: RefreshCw, from: "WebM", to: "MP4" },
  { id: "mp4-to-webm", name: "MP4 to WebM", description: "Convert MP4 to WebM", category: "video", icon: RefreshCw, from: "MP4", to: "WebM" },
  { id: "mp4-to-gif", name: "MP4 to GIF", description: "Create GIF from video", category: "video", icon: RefreshCw, from: "MP4", to: "GIF", popular: true },
  { id: "gif-to-mp4", name: "GIF to MP4", description: "Convert GIF to video", category: "video", icon: RefreshCw, from: "GIF", to: "MP4" },
  { id: "video-trim", name: "Video Trimmer", description: "Trim videos to specific length", category: "video", icon: Scissors, from: "Video", to: "Trimmed" },
  { id: "video-compress", name: "Video Compressor", description: "Reduce video file size", category: "video", icon: Minimize2, from: "Video", to: "Compressed", popular: true },
  { id: "video-resize", name: "Video Resizer", description: "Change video resolution", category: "video", icon: Maximize2, from: "Video", to: "Resized" },
  { id: "video-rotate", name: "Video Rotator", description: "Rotate video orientation", category: "video", icon: RotateCw, from: "Video", to: "Rotated" },

  // Archive Tools (10 tools)
  { id: "zip-create", name: "Create ZIP", description: "Compress files into ZIP archive", category: "archive", icon: Package, from: "Files", to: "ZIP", popular: true },
  { id: "zip-extract", name: "Extract ZIP", description: "Extract files from ZIP archive", category: "archive", icon: FolderOpen, from: "ZIP", to: "Files", popular: true },
  { id: "rar-extract", name: "Extract RAR", description: "Extract files from RAR archive", category: "archive", icon: FolderOpen, from: "RAR", to: "Files" },
  { id: "7z-extract", name: "Extract 7Z", description: "Extract 7-Zip archives", category: "archive", icon: FolderOpen, from: "7Z", to: "Files" },
  { id: "tar-create", name: "Create TAR", description: "Create TAR archive", category: "archive", icon: Package, from: "Files", to: "TAR" },
  { id: "tar-extract", name: "Extract TAR", description: "Extract TAR archive", category: "archive", icon: FolderOpen, from: "TAR", to: "Files" },
  { id: "gzip-compress", name: "GZIP Compress", description: "Compress with GZIP", category: "archive", icon: Package, from: "File", to: "GZ" },
  { id: "gzip-decompress", name: "GZIP Decompress", description: "Decompress GZIP files", category: "archive", icon: FolderOpen, from: "GZ", to: "File" },
  { id: "zip-to-rar", name: "ZIP to RAR", description: "Convert ZIP to RAR archive", category: "archive", icon: RefreshCw, from: "ZIP", to: "RAR" },
  { id: "rar-to-zip", name: "RAR to ZIP", description: "Convert RAR to ZIP archive", category: "archive", icon: RefreshCw, from: "RAR", to: "ZIP" },

  // Developer Tools (15 tools)
  { id: "json-format", name: "JSON Formatter", description: "Format and beautify JSON", category: "code", icon: Braces, from: "JSON", to: "Formatted", popular: true },
  { id: "json-minify", name: "JSON Minifier", description: "Minify JSON data", category: "code", icon: Minimize2, from: "JSON", to: "Minified" },
  { id: "json-to-xml", name: "JSON to XML", description: "Convert JSON to XML format", category: "code", icon: RefreshCw, from: "JSON", to: "XML" },
  { id: "xml-to-json", name: "XML to JSON", description: "Convert XML to JSON", category: "code", icon: RefreshCw, from: "XML", to: "JSON" },
  { id: "json-to-yaml", name: "JSON to YAML", description: "Convert JSON to YAML", category: "code", icon: RefreshCw, from: "JSON", to: "YAML" },
  { id: "yaml-to-json", name: "YAML to JSON", description: "Convert YAML to JSON", category: "code", icon: RefreshCw, from: "YAML", to: "JSON" },
  { id: "html-format", name: "HTML Formatter", description: "Beautify HTML code", category: "code", icon: Braces, from: "HTML", to: "Formatted" },
  { id: "html-minify", name: "HTML Minifier", description: "Minify HTML code", category: "code", icon: Minimize2, from: "HTML", to: "Minified" },
  { id: "css-format", name: "CSS Formatter", description: "Beautify CSS code", category: "code", icon: Braces, from: "CSS", to: "Formatted" },
  { id: "css-minify", name: "CSS Minifier", description: "Minify CSS code", category: "code", icon: Minimize2, from: "CSS", to: "Minified" },
  { id: "js-format", name: "JavaScript Formatter", description: "Beautify JavaScript code", category: "code", icon: Braces, from: "JS", to: "Formatted" },
  { id: "js-minify", name: "JavaScript Minifier", description: "Minify JavaScript code", category: "code", icon: Minimize2, from: "JS", to: "Minified" },
  { id: "base64-encode", name: "Base64 Encode", description: "Encode text to Base64", category: "code", icon: Lock, from: "Text", to: "Base64", popular: true },
  { id: "base64-decode", name: "Base64 Decode", description: "Decode Base64 to text", category: "code", icon: Unlock, from: "Base64", to: "Text", popular: true },
  { id: "url-encode", name: "URL Encode", description: "Encode URL special characters", category: "code", icon: Link, from: "URL", to: "Encoded" },

  // Data Tools (10 tools)
  { id: "csv-to-json", name: "CSV to JSON", description: "Convert CSV data to JSON", category: "data", icon: RefreshCw, from: "CSV", to: "JSON", popular: true },
  { id: "json-to-csv", name: "JSON to CSV", description: "Convert JSON to CSV format", category: "data", icon: RefreshCw, from: "JSON", to: "CSV", popular: true },
  { id: "csv-to-excel", name: "CSV to Excel", description: "Convert CSV to Excel spreadsheet", category: "data", icon: RefreshCw, from: "CSV", to: "XLSX" },
  { id: "excel-to-csv", name: "Excel to CSV", description: "Convert Excel to CSV", category: "data", icon: RefreshCw, from: "XLSX", to: "CSV" },
  { id: "xml-to-csv", name: "XML to CSV", description: "Convert XML data to CSV", category: "data", icon: RefreshCw, from: "XML", to: "CSV" },
  { id: "csv-to-xml", name: "CSV to XML", description: "Convert CSV to XML format", category: "data", icon: RefreshCw, from: "CSV", to: "XML" },
  { id: "sql-format", name: "SQL Formatter", description: "Format and beautify SQL queries", category: "data", icon: Braces, from: "SQL", to: "Formatted" },
  { id: "json-to-sql", name: "JSON to SQL", description: "Generate SQL from JSON", category: "data", icon: RefreshCw, from: "JSON", to: "SQL" },
  { id: "csv-viewer", name: "CSV Viewer", description: "View and explore CSV files", category: "data", icon: Table, from: "CSV", to: "View" },
  { id: "data-generator", name: "Data Generator", description: "Generate mock data", category: "data", icon: Shuffle, from: "Schema", to: "Data" },

  // Text Tools (10 tools)
  { id: "case-converter", name: "Case Converter", description: "Convert text case (upper, lower, title)", category: "text", icon: CaseSensitive, from: "Text", to: "Converted", popular: true },
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, sentences", category: "text", icon: Hash, from: "Text", to: "Count", popular: true },
  { id: "lorem-generator", name: "Lorem Generator", description: "Generate Lorem Ipsum text", category: "text", icon: PilcrowSquare, from: "Options", to: "Lorem" },
  { id: "text-diff", name: "Text Diff", description: "Compare two texts side by side", category: "text", icon: Layers, from: "Text", to: "Diff" },
  { id: "text-reverse", name: "Text Reverser", description: "Reverse text or words", category: "text", icon: RefreshCw, from: "Text", to: "Reversed" },
  { id: "text-sort", name: "Text Sorter", description: "Sort lines alphabetically", category: "text", icon: List, from: "Text", to: "Sorted" },
  { id: "remove-duplicates", name: "Remove Duplicates", description: "Remove duplicate lines", category: "text", icon: Eraser, from: "Text", to: "Cleaned" },
  { id: "text-encrypt", name: "Text Encryptor", description: "Encrypt text with password", category: "text", icon: Shield, from: "Text", to: "Encrypted" },
  { id: "qr-generator", name: "QR Code Generator", description: "Generate QR codes from text", category: "text", icon: QrCode, from: "Text", to: "QR Code", popular: true },
  { id: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA hashes", category: "text", icon: Key, from: "Text", to: "Hash" },
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