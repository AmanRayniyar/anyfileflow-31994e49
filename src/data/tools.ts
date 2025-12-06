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
  toolType?: 'image-convert' | 'image-edit' | 'pdf' | 'audio' | 'video' | 'text' | 'data' | 'health' | 'generator';
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
  | "health";

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export const categories: CategoryInfo[] = [
  { id: "image", name: "File & Image Tools", description: "Convert, resize, compress images and files", icon: Image, colorClass: "text-tool-image", bgClass: "bg-tool-image/10" },
  { id: "audio", name: "Audio Tools", description: "Convert, edit, and enhance audio files", icon: Music, colorClass: "text-tool-audio", bgClass: "bg-tool-audio/10" },
  { id: "video", name: "Video Tools", description: "Video conversion, editing, and effects", icon: Video, colorClass: "text-tool-video", bgClass: "bg-tool-video/10" },
  { id: "text", name: "Text & Writing Tools", description: "Text manipulation and writing utilities", icon: Type, colorClass: "text-tool-text", bgClass: "bg-tool-text/10" },
  { id: "data", name: "Data & Dev Tools", description: "Data conversion and developer utilities", icon: Code, colorClass: "text-tool-code", bgClass: "bg-tool-code/10" },
  { id: "health", name: "Health & Fitness", description: "Health calculators and fitness tools", icon: Heart, colorClass: "text-tool-archive", bgClass: "bg-tool-archive/10" },
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
  { id: "heic-to-jpg", name: "HEIC to JPG Converter", description: "Convert iPhone HEIC photos to JPG", category: "image", icon: RefreshCw, from: "HEIC", to: "JPG", popular: true, toolType: 'image-convert' },
  { id: "heic-to-png", name: "HEIC to PNG Converter", description: "Convert HEIC to PNG format", category: "image", icon: RefreshCw, from: "HEIC", to: "PNG", toolType: 'image-convert' },
  { id: "image-to-pdf", name: "Image to PDF Converter", description: "Convert images to PDF document", category: "image", icon: FileText, from: "Image", to: "PDF", popular: true, toolType: 'pdf' },
  { id: "pdf-to-image", name: "PDF to Image Converter", description: "Convert PDF pages to images", category: "image", icon: Image, from: "PDF", to: "Image", toolType: 'pdf' },
  { id: "pdf-compressor", name: "PDF Compressor", description: "Reduce PDF file size while maintaining quality", category: "image", icon: Minimize2, from: "PDF", to: "PDF", popular: true, toolType: 'pdf' },
  { id: "pdf-merger", name: "PDF Merger", description: "Combine multiple PDFs into one document", category: "image", icon: Layers, from: "PDF", to: "PDF", popular: true, toolType: 'pdf' },
  { id: "pdf-splitter", name: "PDF Splitter", description: "Split PDF into separate pages or sections", category: "image", icon: Scissors, from: "PDF", to: "PDF", toolType: 'pdf' },
  { id: "pdf-unlocker", name: "PDF Unlocker", description: "Remove password protection from PDF", category: "image", icon: Unlock, from: "PDF", to: "PDF", toolType: 'pdf' },
  { id: "pdf-protect", name: "PDF Protect", description: "Add password protection to PDF files", category: "image", icon: Lock, from: "PDF", to: "PDF", toolType: 'pdf' },
  { id: "pdf-metadata", name: "PDF Metadata Editor", description: "Edit PDF title, author, and metadata", category: "image", icon: FileText, from: "PDF", to: "PDF", toolType: 'pdf' },
  
  // Image Editing Tools
  { id: "image-compressor", name: "Image Compressor", description: "Compress images without losing quality", category: "image", icon: Minimize2, from: "Image", to: "Compressed", popular: true, toolType: 'image-edit' },
  { id: "image-resizer", name: "Image Resizer", description: "Resize images to any dimension", category: "image", icon: Maximize2, from: "Image", to: "Resized", popular: true, toolType: 'image-edit' },
  { id: "image-cropper", name: "Image Cropper", description: "Crop images to specific dimensions", category: "image", icon: Crop, from: "Image", to: "Cropped", toolType: 'image-edit' },
  { id: "image-rotator", name: "Image Rotator", description: "Rotate images by any angle", category: "image", icon: RotateCw, from: "Image", to: "Rotated", toolType: 'image-edit' },
  { id: "image-flipper", name: "Image Flipper", description: "Flip images horizontally or vertically", category: "image", icon: FlipHorizontal, from: "Image", to: "Flipped", toolType: 'image-edit' },
  { id: "color-picker", name: "Image Color Picker", description: "Extract colors from any image", category: "image", icon: Pipette, from: "Image", to: "Colors", toolType: 'image-edit' },
  { id: "background-remover", name: "Image Background Remover", description: "Remove background from images automatically", category: "image", icon: Eraser, from: "Image", to: "Transparent", popular: true, toolType: 'image-edit' },
  { id: "image-blur", name: "Image Blur Tool", description: "Apply blur effect to images", category: "image", icon: Circle, from: "Image", to: "Blurred", toolType: 'image-edit' },
  { id: "image-sharpen", name: "Image Sharpen Tool", description: "Sharpen and enhance image details", category: "image", icon: Sparkles, from: "Image", to: "Sharpened", toolType: 'image-edit' },
  { id: "image-filter", name: "Image Filter Editor", description: "Apply filters and effects to images", category: "image", icon: Filter, from: "Image", to: "Filtered", toolType: 'image-edit' },
  { id: "merge-images", name: "Merge Images", description: "Combine multiple images into one", category: "image", icon: Layers, from: "Images", to: "Merged", toolType: 'image-edit' },
  { id: "ocr-extract", name: "Extract Text (OCR)", description: "Extract text from images using OCR", category: "image", icon: Eye, from: "Image", to: "Text", popular: true, toolType: 'image-edit' },
  { id: "svg-to-png", name: "SVG to PNG Converter", description: "Convert SVG to PNG raster image", category: "image", icon: RefreshCw, from: "SVG", to: "PNG", toolType: 'image-convert' },
  { id: "png-to-svg", name: "PNG to SVG Converter", description: "Vectorize PNG to SVG format", category: "image", icon: RefreshCw, from: "PNG", to: "SVG", toolType: 'image-convert' },
  { id: "ico-to-png", name: "ICO to PNG Converter", description: "Convert icon files to PNG", category: "image", icon: RefreshCw, from: "ICO", to: "PNG", toolType: 'image-convert' },
  { id: "bmp-to-jpg", name: "BMP to JPG Converter", description: "Convert BMP images to JPG", category: "image", icon: RefreshCw, from: "BMP", to: "JPG", toolType: 'image-convert' },
  { id: "raw-to-jpg", name: "RAW to JPG Converter", description: "Convert camera RAW files to JPG", category: "image", icon: Camera, from: "RAW", to: "JPG", toolType: 'image-convert' },
  { id: "watermark-image", name: "Watermark Image", description: "Add text or image watermark", category: "image", icon: Stamp, from: "Image", to: "Watermarked", toolType: 'image-edit' },
  { id: "remove-watermark", name: "Remove Watermark", description: "Remove watermarks from images using AI", category: "image", icon: Eraser, from: "Image", to: "Clean", toolType: 'image-edit' },
  { id: "meme-generator", name: "Meme Generator", description: "Create memes with custom text", category: "image", icon: Laugh, from: "Image", to: "Meme", popular: true, toolType: 'image-edit' },
  { id: "image-annotation", name: "Image Annotation Tool", description: "Add text, arrows, and shapes to images", category: "image", icon: Brush, from: "Image", to: "Annotated", toolType: 'image-edit' },
  { id: "sticker-maker", name: "Image Sticker Maker", description: "Create stickers from images", category: "image", icon: Sticker, from: "Image", to: "Sticker", toolType: 'image-edit' },
  { id: "ai-cartoonizer", name: "AI Cartoonizer", description: "Transform photos into cartoon style", category: "image", icon: Wand2, from: "Photo", to: "Cartoon", toolType: 'image-edit' },
  { id: "pixel-art", name: "Pixel Art Converter", description: "Convert images to pixel art", category: "image", icon: Grid, from: "Image", to: "Pixel Art", toolType: 'image-edit' },
  { id: "color-palette", name: "Color Palette Extractor", description: "Extract color palette from images", category: "image", icon: Palette, from: "Image", to: "Palette", toolType: 'image-edit' },
  { id: "gradient-generator", name: "Gradient Generator", description: "Create beautiful CSS gradients", category: "image", icon: Droplet, from: "Colors", to: "Gradient", toolType: 'generator' },
  { id: "favicon-generator", name: "Favicon Generator", description: "Generate favicon from images", category: "image", icon: Square, from: "Image", to: "Favicon", toolType: 'image-edit' },
  { id: "transparent-png", name: "Transparent PNG Maker", description: "Make image backgrounds transparent", category: "image", icon: Circle, from: "Image", to: "Transparent", toolType: 'image-edit' },
  { id: "noise-reducer", name: "Image Noise Reducer", description: "Remove noise and grain from images", category: "image", icon: Sparkles, from: "Image", to: "Clean", toolType: 'image-edit' },
  { id: "hdr-enhancer", name: "Image HDR Enhancer", description: "Enhance images with HDR effect", category: "image", icon: Sun, from: "Image", to: "HDR", toolType: 'image-edit' },
  { id: "background-blur", name: "Background Blur Tool", description: "Blur background while keeping subject sharp", category: "image", icon: Circle, from: "Image", to: "Blurred BG", toolType: 'image-edit' },

  // ============================================
  // 🎧 AUDIO TOOLS (46-75)
  // ============================================
  { id: "audio-cutter", name: "Audio Cutter", description: "Cut and trim audio files", category: "audio", icon: Scissors, from: "Audio", to: "Cut", popular: true, toolType: 'audio' },
  { id: "audio-joiner", name: "Audio Joiner", description: "Join multiple audio files together", category: "audio", icon: Layers, from: "Audio", to: "Joined", toolType: 'audio' },
  { id: "mp3-converter", name: "MP3 Converter", description: "Convert between MP3, WAV, and OGG formats", category: "audio", icon: RefreshCw, from: "Audio", to: "MP3", popular: true, toolType: 'audio' },
  { id: "audio-speed", name: "Audio Speed Changer", description: "Change audio playback speed", category: "audio", icon: FastForward, from: "Audio", to: "Speed", toolType: 'audio' },
  { id: "volume-booster", name: "MP3 Volume Booster", description: "Increase audio volume", category: "audio", icon: Volume2, from: "Audio", to: "Boosted", toolType: 'audio' },
  { id: "audio-compressor", name: "Audio Compressor", description: "Compress audio files", category: "audio", icon: Minimize2, from: "Audio", to: "Compressed", toolType: 'audio' },
  { id: "audio-normalizer", name: "Audio Normalizer", description: "Normalize audio levels", category: "audio", icon: Sliders, from: "Audio", to: "Normalized", toolType: 'audio' },
  { id: "noise-removal", name: "Noise Removal from Audio", description: "Remove background noise from audio", category: "audio", icon: VolumeX, from: "Audio", to: "Clean", popular: true, toolType: 'audio' },
  { id: "audio-equalizer", name: "Audio Equalizer", description: "Adjust audio frequencies", category: "audio", icon: Sliders, from: "Audio", to: "EQ", toolType: 'audio' },
  { id: "audio-reverser", name: "Audio Reverser", description: "Reverse audio playback", category: "audio", icon: Rewind, from: "Audio", to: "Reversed", toolType: 'audio' },
  { id: "remove-vocals", name: "Remove Vocals", description: "Remove vocals from music tracks", category: "audio", icon: Mic, from: "Audio", to: "Karaoke", popular: true, toolType: 'audio' },
  { id: "extract-vocals", name: "Extract Vocals", description: "Extract vocals from music", category: "audio", icon: Mic, from: "Audio", to: "Vocals", toolType: 'audio' },
  { id: "video-to-mp3", name: "Convert Video to MP3", description: "Extract audio from video files", category: "audio", icon: Music, from: "Video", to: "MP3", popular: true, toolType: 'audio' },
  { id: "text-to-speech", name: "Text to Speech", description: "Convert text to spoken audio", category: "audio", icon: Volume2, from: "Text", to: "Audio", popular: true, toolType: 'audio' },
  { id: "speech-to-text", name: "Speech to Text", description: "Transcribe audio to text", category: "audio", icon: Mic, from: "Audio", to: "Text", popular: true, toolType: 'audio' },
  { id: "pitch-changer", name: "Audio Pitch Changer", description: "Change audio pitch up or down", category: "audio", icon: AudioLines, from: "Audio", to: "Pitch", toolType: 'audio' },
  { id: "audio-trimmer", name: "Audio Trimmer", description: "Trim audio start and end", category: "audio", icon: Scissors, from: "Audio", to: "Trimmed", toolType: 'audio' },
  { id: "audio-fade", name: "Audio Fade In/Out", description: "Add fade effects to audio", category: "audio", icon: Sliders, from: "Audio", to: "Faded", toolType: 'audio' },
  { id: "audio-loop", name: "Audio Loop Maker", description: "Create seamless audio loops", category: "audio", icon: Repeat, from: "Audio", to: "Loop", toolType: 'audio' },
  { id: "audio-splitter", name: "Audio Splitter", description: "Split audio into parts", category: "audio", icon: Split, from: "Audio", to: "Split", toolType: 'audio' },
  { id: "waveform-visualizer", name: "Audio Waveform Visualizer", description: "Visualize audio waveforms", category: "audio", icon: AudioWaveform, from: "Audio", to: "Visual", toolType: 'audio' },
  { id: "audio-metadata", name: "Audio Metadata Editor", description: "Edit MP3 tags and metadata", category: "audio", icon: FileAudio, from: "Audio", to: "Tagged", toolType: 'audio' },
  { id: "ringtone-cutter", name: "Ringtone Cutter", description: "Create custom ringtones", category: "audio", icon: Smartphone, from: "Audio", to: "Ringtone", toolType: 'audio' },
  { id: "merge-mp3", name: "Merge MP3 Files", description: "Combine multiple MP3 files", category: "audio", icon: Merge, from: "MP3", to: "Merged", toolType: 'audio' },
  { id: "remove-silence", name: "Remove Silence from Audio", description: "Remove silent parts from audio", category: "audio", icon: VolumeX, from: "Audio", to: "Clean", toolType: 'audio' },
  { id: "mp3-tag-editor", name: "MP3 Tag Editor", description: "Edit ID3 tags for MP3 files", category: "audio", icon: FileAudio, from: "MP3", to: "Tagged", toolType: 'audio' },
  { id: "audio-recorder", name: "Audio Recorder", description: "Record audio from microphone", category: "audio", icon: Mic, from: "Mic", to: "Audio", popular: true, toolType: 'audio' },
  { id: "frequency-detector", name: "Sound Frequency Detector", description: "Detect audio frequencies", category: "audio", icon: AudioLines, from: "Audio", to: "Hz", toolType: 'audio' },
  { id: "noise-meter", name: "Noise Meter Tool", description: "Measure ambient noise levels", category: "audio", icon: Gauge, from: "Mic", to: "dB", toolType: 'audio' },
  { id: "white-noise", name: "White Noise Generator", description: "Generate white, pink, or brown noise", category: "audio", icon: Radio, from: "Type", to: "Noise", toolType: 'audio' },

  // ============================================
  // 🎥 VIDEO TOOLS (76-115)
  // ============================================
  { id: "video-compressor", name: "Video Compressor", description: "Compress video files", category: "video", icon: Minimize2, from: "Video", to: "Compressed", popular: true, toolType: 'video' },
  { id: "video-cutter", name: "Video Cutter", description: "Cut and trim video files", category: "video", icon: Scissors, from: "Video", to: "Cut", popular: true, toolType: 'video' },
  { id: "video-trimmer", name: "Video Trimmer", description: "Trim video start and end", category: "video", icon: Scissors, from: "Video", to: "Trimmed", toolType: 'video' },
  { id: "video-joiner", name: "Video Joiner", description: "Join multiple videos together", category: "video", icon: Layers, from: "Videos", to: "Joined", toolType: 'video' },
  { id: "video-resizer", name: "Video Resize Tool", description: "Change video dimensions", category: "video", icon: Maximize2, from: "Video", to: "Resized", toolType: 'video' },
  { id: "video-cropper", name: "Video Cropper", description: "Crop video to specific area", category: "video", icon: Crop, from: "Video", to: "Cropped", toolType: 'video' },
  { id: "video-rotator", name: "Video Rotator", description: "Rotate video orientation", category: "video", icon: RotateCw, from: "Video", to: "Rotated", toolType: 'video' },
  { id: "video-flipper", name: "Video Flipper", description: "Flip video horizontally or vertically", category: "video", icon: FlipHorizontal, from: "Video", to: "Flipped", toolType: 'video' },
  { id: "video-stabilizer", name: "Video Stabilizer", description: "Stabilize shaky video footage", category: "video", icon: Move, from: "Video", to: "Stabilized", toolType: 'video' },
  { id: "video-to-gif", name: "Video to GIF Converter", description: "Convert video clips to GIF", category: "video", icon: RefreshCw, from: "Video", to: "GIF", popular: true, toolType: 'video' },
  { id: "video-speed", name: "Video Speed Changer", description: "Change video playback speed", category: "video", icon: FastForward, from: "Video", to: "Speed", toolType: 'video' },
  { id: "slow-motion", name: "Slow Motion Video", description: "Create slow motion effect", category: "video", icon: Rewind, from: "Video", to: "Slow", toolType: 'video' },
  { id: "fast-motion", name: "Fast Motion Video", description: "Speed up video playback", category: "video", icon: FastForward, from: "Video", to: "Fast", toolType: 'video' },
  { id: "mute-video", name: "Mute Video", description: "Remove audio from video", category: "video", icon: VolumeX, from: "Video", to: "Muted", toolType: 'video' },
  { id: "extract-audio", name: "Extract Audio from Video", description: "Extract audio track from video", category: "video", icon: Music, from: "Video", to: "Audio", toolType: 'video' },
  { id: "extract-frames", name: "Extract Frames", description: "Extract image frames from video", category: "video", icon: Image, from: "Video", to: "Frames", toolType: 'video' },
  { id: "gif-to-mp4", name: "GIF to MP4 Converter", description: "Convert GIF to MP4 video", category: "video", icon: RefreshCw, from: "GIF", to: "MP4", toolType: 'video' },
  { id: "add-watermark-video", name: "Add Watermark to Video", description: "Add text or image watermark to video", category: "video", icon: Stamp, from: "Video", to: "Watermarked", toolType: 'video' },
  { id: "remove-watermark-video", name: "Remove Video Watermark", description: "Remove watermarks from video using AI", category: "video", icon: Eraser, from: "Video", to: "Clean", toolType: 'video' },
  { id: "add-subtitles", name: "Add Subtitles to Video", description: "Add subtitles and captions", category: "video", icon: FileText, from: "Video", to: "Subtitled", toolType: 'video' },
  { id: "subtitle-embedder", name: "Subtitle to Video Embedder", description: "Embed SRT subtitles into video", category: "video", icon: FileText, from: "Video+SRT", to: "Video", toolType: 'video' },
  { id: "mov-to-mp4", name: "Convert MOV to MP4", description: "Convert QuickTime MOV to MP4", category: "video", icon: RefreshCw, from: "MOV", to: "MP4", popular: true, toolType: 'video' },
  { id: "avi-to-mp4", name: "Convert AVI to MP4", description: "Convert AVI to MP4 format", category: "video", icon: RefreshCw, from: "AVI", to: "MP4", toolType: 'video' },
  { id: "mkv-to-mp4", name: "Convert MKV to MP4", description: "Convert MKV to MP4 format", category: "video", icon: RefreshCw, from: "MKV", to: "MP4", toolType: 'video' },
  { id: "video-brightness", name: "Video Brightness Tool", description: "Adjust video brightness", category: "video", icon: Sun, from: "Video", to: "Bright", toolType: 'video' },
  { id: "video-contrast", name: "Video Contrast Tool", description: "Adjust video contrast", category: "video", icon: Contrast, from: "Video", to: "Contrast", toolType: 'video' },
  { id: "video-saturation", name: "Video Saturation Tool", description: "Adjust video color saturation", category: "video", icon: Palette, from: "Video", to: "Saturated", toolType: 'video' },
  { id: "video-color-grading", name: "Video Color Grading", description: "Apply color grading to video", category: "video", icon: Palette, from: "Video", to: "Graded", toolType: 'video' },
  { id: "reverse-video", name: "Reverse Video", description: "Play video in reverse", category: "video", icon: Rewind, from: "Video", to: "Reversed", toolType: 'video' },
  { id: "boomerang-video", name: "Boomerang Video Maker", description: "Create boomerang loop videos", category: "video", icon: Repeat, from: "Video", to: "Boomerang", toolType: 'video' },
  { id: "merge-video-audio", name: "Merge Video + Audio", description: "Combine video with audio track", category: "video", icon: Merge, from: "Video+Audio", to: "Video", toolType: 'video' },
  { id: "aspect-ratio", name: "Aspect Ratio Changer", description: "Change video aspect ratio", category: "video", icon: Maximize2, from: "Video", to: "Ratio", toolType: 'video' },
  { id: "thumbnail-generator", name: "Video Thumbnail Generator", description: "Generate thumbnails from video", category: "video", icon: Image, from: "Video", to: "Thumbnail", toolType: 'video' },
  { id: "frame-rate", name: "Video Frame Rate Changer", description: "Change video FPS", category: "video", icon: Film, from: "Video", to: "FPS", toolType: 'video' },
  { id: "remove-bg-video", name: "Remove Background from Video", description: "Remove video background using AI", category: "video", icon: Eraser, from: "Video", to: "No BG", toolType: 'video' },
  { id: "add-bg-video", name: "Add Background to Video", description: "Add custom background to video", category: "video", icon: ImagePlus, from: "Video", to: "With BG", toolType: 'video' },
  { id: "video-watermark-text", name: "Video Watermark Text", description: "Add text watermark to video", category: "video", icon: Type, from: "Video", to: "Watermarked", toolType: 'video' },
  { id: "social-media-resize", name: "Video Resize for Social Media", description: "Resize video for Instagram, TikTok, YouTube", category: "video", icon: Smartphone, from: "Video", to: "Social", toolType: 'video' },
  { id: "video-upscaler", name: "Video Upscaler (AI)", description: "Upscale video resolution using AI", category: "video", icon: ZoomIn, from: "Video", to: "HD", toolType: 'video' },
  { id: "animated-meme", name: "Animated Meme Generator", description: "Create animated video memes", category: "video", icon: Laugh, from: "Video", to: "Meme", toolType: 'video' },

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
  { id: "plagiarism-checker", name: "Plagiarism Checker", description: "Check text for plagiarism", category: "text", icon: Search, from: "Text", to: "Report", toolType: 'text' },
  { id: "grammar-checker", name: "Grammar Checker", description: "Check and fix grammar errors", category: "text", icon: Check, from: "Text", to: "Fixed", popular: true, toolType: 'text' },
  { id: "text-summarizer", name: "Text Summarizer", description: "Summarize long text automatically", category: "text", icon: Minimize2, from: "Text", to: "Summary", popular: true, toolType: 'text' },
  { id: "paraphraser", name: "Text Paraphraser", description: "Rewrite text in different words", category: "text", icon: RefreshCw, from: "Text", to: "Paraphrased", popular: true, toolType: 'text' },
  { id: "text-translator", name: "Text Translator", description: "Translate text to different languages", category: "text", icon: Globe, from: "Text", to: "Translated", popular: true, toolType: 'text' },
  { id: "paragraph-generator", name: "Random Paragraph Generator", description: "Generate random paragraphs", category: "text", icon: PilcrowSquare, from: "Options", to: "Paragraph", toolType: 'text' },
  { id: "word-generator", name: "Random Word Generator", description: "Generate random words", category: "text", icon: Shuffle, from: "Options", to: "Words", toolType: 'text' },
  { id: "password-generator", name: "Random Password Generator", description: "Generate secure passwords", category: "text", icon: Key, from: "Options", to: "Password", popular: true, toolType: 'generator' },
  { id: "username-generator", name: "Random Username Generator", description: "Generate unique usernames", category: "text", icon: User, from: "Options", to: "Username", toolType: 'generator' },
  { id: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate Lorem Ipsum placeholder text", category: "text", icon: PilcrowSquare, from: "Options", to: "Lorem", toolType: 'text' },
  { id: "number-to-words", name: "Number to Words Converter", description: "Convert numbers to written words", category: "text", icon: Hash, from: "Number", to: "Words", toolType: 'text' },
  { id: "words-to-number", name: "Words to Number Converter", description: "Convert written words to numbers", category: "text", icon: Hash, from: "Words", to: "Number", toolType: 'text' },
  { id: "emoji-remover", name: "Emoji Remover", description: "Remove emojis from text", category: "text", icon: Trash2, from: "Text", to: "Clean", toolType: 'text' },
  { id: "find-replace", name: "Find & Replace Tool", description: "Find and replace text", category: "text", icon: Search, from: "Text", to: "Replaced", toolType: 'text' },
  { id: "keyword-density", name: "Keyword Density Checker", description: "Check keyword density in text", category: "text", icon: Percent, from: "Text", to: "Report", toolType: 'text' },
  { id: "case-swap", name: "Case Swap Tool", description: "Swap uppercase and lowercase letters", category: "text", icon: CaseSensitive, from: "Text", to: "Swapped", toolType: 'text' },
  { id: "text-merger", name: "Text Merger Tool", description: "Merge multiple text blocks", category: "text", icon: Merge, from: "Texts", to: "Merged", toolType: 'text' },
  { id: "article-rewriter", name: "Article Rewriter", description: "Rewrite articles automatically", category: "text", icon: RefreshCw, from: "Article", to: "Rewritten", toolType: 'text' },
  { id: "blog-ideas", name: "Blog Idea Generator", description: "Generate blog post ideas", category: "text", icon: Sparkles, from: "Topic", to: "Ideas", toolType: 'generator' },
  { id: "caption-creator", name: "Social Media Caption Creator", description: "Create engaging social media captions", category: "text", icon: Smartphone, from: "Topic", to: "Caption", toolType: 'generator' },
  { id: "hashtag-generator", name: "Hashtag Generator", description: "Generate relevant hashtags", category: "text", icon: Hash, from: "Topic", to: "Hashtags", toolType: 'generator' },
  { id: "notes-app", name: "Notes App Online", description: "Simple online notes application", category: "text", icon: FileText, from: "Text", to: "Saved", toolType: 'text' },
  { id: "calendar-generator", name: "Calendar Generator", description: "Generate printable calendars", category: "text", icon: Calendar, from: "Options", to: "Calendar", toolType: 'generator' },
  { id: "todo-list", name: "To-Do List App", description: "Simple to-do list manager", category: "text", icon: Check, from: "Tasks", to: "List", toolType: 'text' },
  { id: "pomodoro-timer", name: "Pomodoro Timer", description: "Productivity timer with breaks", category: "text", icon: Timer, from: "Settings", to: "Timer", toolType: 'text' },
  { id: "stopwatch", name: "Stopwatch", description: "Online stopwatch with lap times", category: "text", icon: Clock, from: "Start", to: "Time", toolType: 'text' },
  { id: "countdown-timer", name: "Countdown Timer", description: "Countdown to any date or time", category: "text", icon: Timer, from: "Target", to: "Countdown", toolType: 'text' },
  { id: "typing-test", name: "Typing Speed Test", description: "Test your typing speed", category: "text", icon: TypeIcon, from: "Test", to: "WPM", popular: true, toolType: 'text' },
  { id: "paragraph-formatter", name: "Paragraph Formatter", description: "Format and clean up paragraphs", category: "text", icon: AlignLeft, from: "Text", to: "Formatted", toolType: 'text' },
  { id: "quote-generator", name: "Random Quote Generator", description: "Generate inspirational quotes", category: "text", icon: Quote, from: "Category", to: "Quote", toolType: 'generator' },

  // ============================================
  // 📊 DATA, CODE, & DEV TOOLS (156-185)
  // ============================================
  { id: "json-formatter", name: "JSON Formatter", description: "Format and beautify JSON data", category: "data", icon: Braces, from: "JSON", to: "Formatted", popular: true, toolType: 'data' },
  { id: "json-validator", name: "JSON Validator", description: "Validate JSON syntax", category: "data", icon: Check, from: "JSON", to: "Valid", toolType: 'data' },
  { id: "json-to-csv", name: "JSON to CSV Converter", description: "Convert JSON to CSV format", category: "data", icon: RefreshCw, from: "JSON", to: "CSV", popular: true, toolType: 'data' },
  { id: "csv-to-json", name: "CSV to JSON Converter", description: "Convert CSV to JSON format", category: "data", icon: RefreshCw, from: "CSV", to: "JSON", toolType: 'data' },
  { id: "html-minifier", name: "HTML Minifier", description: "Minify HTML code", category: "data", icon: Minimize2, from: "HTML", to: "Minified", toolType: 'data' },
  { id: "css-minifier", name: "CSS Minifier", description: "Minify CSS code", category: "data", icon: Minimize2, from: "CSS", to: "Minified", toolType: 'data' },
  { id: "js-minifier", name: "JS Minifier", description: "Minify JavaScript code", category: "data", icon: Minimize2, from: "JS", to: "Minified", toolType: 'data' },
  { id: "uuid-generator", name: "UUID Generator", description: "Generate unique UUIDs", category: "data", icon: Key, from: "Options", to: "UUID", popular: true, toolType: 'generator' },
  { id: "base64-encoder", name: "Base64 Encoder", description: "Encode text to Base64", category: "data", icon: Lock, from: "Text", to: "Base64", toolType: 'data' },
  { id: "base64-decoder", name: "Base64 Decoder", description: "Decode Base64 to text", category: "data", icon: Unlock, from: "Base64", to: "Text", toolType: 'data' },
  { id: "url-encoder", name: "URL Encoder", description: "Encode URL special characters", category: "data", icon: Link, from: "URL", to: "Encoded", toolType: 'data' },
  { id: "url-decoder", name: "URL Decoder", description: "Decode URL encoded strings", category: "data", icon: Link, from: "Encoded", to: "URL", toolType: 'data' },
  { id: "md5-generator", name: "MD5 Hash Generator", description: "Generate MD5 hash", category: "data", icon: Key, from: "Text", to: "MD5", toolType: 'data' },
  { id: "sha256-generator", name: "SHA-256 Hash Generator", description: "Generate SHA-256 hash", category: "data", icon: Key, from: "Text", to: "SHA-256", toolType: 'data' },
  { id: "qr-generator", name: "QR Code Generator", description: "Generate QR codes from text or URL", category: "data", icon: QrCode, from: "Text", to: "QR", popular: true, toolType: 'generator' },
  { id: "qr-scanner", name: "QR Code Scanner", description: "Scan and read QR codes", category: "data", icon: QrCode, from: "QR", to: "Text", toolType: 'data' },
  { id: "regex-tester", name: "Regex Tester", description: "Test regular expressions", category: "data", icon: Regex, from: "Regex", to: "Match", toolType: 'data' },
  { id: "color-picker-dev", name: "Color Picker", description: "Pick and convert colors", category: "data", icon: Palette, from: "Color", to: "Codes", toolType: 'data' },
  { id: "hex-to-rgb", name: "HEX to RGB Converter", description: "Convert HEX color to RGB", category: "data", icon: Palette, from: "HEX", to: "RGB", toolType: 'data' },
  { id: "rgb-to-hex", name: "RGB to HEX Converter", description: "Convert RGB color to HEX", category: "data", icon: Palette, from: "RGB", to: "HEX", toolType: 'data' },
  { id: "cmyk-to-rgb", name: "CMYK to RGB Converter", description: "Convert CMYK color to RGB", category: "data", icon: Palette, from: "CMYK", to: "RGB", toolType: 'data' },
  { id: "password-strength", name: "Password Strength Checker", description: "Check password security level", category: "data", icon: Shield, from: "Password", to: "Score", toolType: 'data' },
  { id: "ip-finder", name: "IP Address Finder", description: "Find your public IP address", category: "data", icon: Globe, from: "Request", to: "IP", toolType: 'data' },
  { id: "user-agent", name: "User Agent Detector", description: "Detect browser user agent", category: "data", icon: Info, from: "Browser", to: "UA", toolType: 'data' },
  { id: "browser-fingerprint", name: "Browser Fingerprint Tool", description: "Generate browser fingerprint", category: "data", icon: Shield, from: "Browser", to: "Hash", toolType: 'data' },
  { id: "screen-resolution", name: "Screen Resolution Checker", description: "Check screen resolution", category: "data", icon: MonitorPlay, from: "Screen", to: "Resolution", toolType: 'data' },
  { id: "internet-speed", name: "Internet Speed Test", description: "Test your internet connection speed", category: "data", icon: Wifi, from: "Network", to: "Mbps", popular: true, toolType: 'data' },
  { id: "dns-lookup", name: "DNS Lookup", description: "Look up DNS records", category: "data", icon: Globe, from: "Domain", to: "DNS", toolType: 'data' },
  { id: "whois-lookup", name: "WHOIS Lookup", description: "Look up domain registration info", category: "data", icon: Search, from: "Domain", to: "WHOIS", toolType: 'data' },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes from text", category: "data", icon: Barcode, from: "Text", to: "Barcode", toolType: 'generator' },

  // ============================================
  // 🫀 HEALTH & FITNESS TOOLS (186-200)
  // ============================================
  { id: "bmi-calculator", name: "BMI Calculator", description: "Calculate Body Mass Index", category: "health", icon: Scale, from: "Height/Weight", to: "BMI", popular: true, toolType: 'health' },
  { id: "body-fat", name: "Body Fat Calculator", description: "Estimate body fat percentage", category: "health", icon: Activity, from: "Measurements", to: "Body Fat %", toolType: 'health' },
  { id: "calorie-calculator", name: "Calorie Calculator", description: "Calculate daily calorie needs", category: "health", icon: Cookie, from: "Activity", to: "Calories", popular: true, toolType: 'health' },
  { id: "bmr-calculator", name: "BMR Calculator", description: "Calculate Basal Metabolic Rate", category: "health", icon: Activity, from: "Stats", to: "BMR", toolType: 'health' },
  { id: "water-intake", name: "Water Intake Calculator", description: "Calculate daily water intake", category: "health", icon: Droplets, from: "Weight", to: "Liters", toolType: 'health' },
  { id: "ideal-weight", name: "Ideal Weight Calculator", description: "Calculate ideal body weight", category: "health", icon: Scale, from: "Height", to: "Weight", toolType: 'health' },
  { id: "pregnancy-due", name: "Pregnancy Due Date Calculator", description: "Calculate expected due date", category: "health", icon: Baby, from: "LMP", to: "Due Date", toolType: 'health' },
  { id: "ovulation", name: "Ovulation Calculator", description: "Calculate ovulation dates", category: "health", icon: Calendar, from: "Cycle", to: "Dates", toolType: 'health' },
  { id: "heart-rate-zone", name: "Heart Rate Zone Calculator", description: "Calculate heart rate training zones", category: "health", icon: HeartPulse, from: "Age", to: "Zones", toolType: 'health' },
  { id: "tdee-calculator", name: "TDEE Calculator", description: "Calculate Total Daily Energy Expenditure", category: "health", icon: Activity, from: "Stats", to: "TDEE", toolType: 'health' },
  { id: "macro-calculator", name: "Macro Calculator", description: "Calculate daily macronutrient needs", category: "health", icon: Cookie, from: "Goals", to: "Macros", toolType: 'health' },
  { id: "sleep-calculator", name: "Sleep Calculator", description: "Calculate optimal sleep and wake times", category: "health", icon: Bed, from: "Time", to: "Schedule", toolType: 'health' },
  { id: "step-calorie", name: "Step-to-Calorie Calculator", description: "Convert steps to calories burned", category: "health", icon: Footprints, from: "Steps", to: "Calories", toolType: 'health' },
  { id: "blood-pressure", name: "Blood Pressure Checker Guide", description: "Understand blood pressure readings", category: "health", icon: HeartPulse, from: "BP", to: "Guide", toolType: 'health' },
  { id: "waist-height", name: "Waist-to-Height Ratio Calculator", description: "Calculate waist-to-height ratio", category: "health", icon: Ruler, from: "Measurements", to: "Ratio", toolType: 'health' },
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
